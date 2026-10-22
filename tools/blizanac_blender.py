# Medijana — digitalni blizanac: Blender generator
# Čita data/GEOMETRIJA.jsonl (isti izvor istine kao blizanac.html) i gradi 3D scenu,
# izvozi modeli/medijana.glb i renderuje assets/blizanac-render.png.
# Pokretanje (headless):
#   blender -b --factory-startup -P tools/blizanac_blender.py
# Koordinate: JSONL koristi [x, z] u ravni (Three.js y-gore); Blender je z-gore,
# pa JSONL "z" postaje Blender "-y" (sever ostaje sever u obe makete).
import bpy, bmesh, json, math, os, sys, mathutils

KOREN = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BOJE = {
    "objavljena_dimenzija": (0.33, 0.42, 0.24, 1.0),
    "izvedeno_iz_povrsine": (0.62, 0.47, 0.18, 0.9),
    "sematski":             (0.55, 0.23, 0.10, 0.55),
}
REZIM = "rek"  # "rek" = rekonstruisane visine, "sac" = sačuvano stanje

def jsonl(p):
    with open(p, encoding="utf-8") as f:
        return [json.loads(l) for l in f if l.strip()]

def mat(pouzdanost):
    ime = "pz_" + pouzdanost
    m = bpy.data.materials.get(ime)
    if m: return m
    m = bpy.data.materials.new(ime)
    m.use_nodes = True
    r, g, b, a = BOJE.get(pouzdanost, (.5, .5, .5, 1))
    bsdf = m.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (r, g, b, 1)
    bsdf.inputs["Roughness"].default_value = 0.85
    if a < 1:
        bsdf.inputs["Alpha"].default_value = a
        m.blend_method = "BLEND"
    return m

def prizma(ime, tacke2d, h, z0=0.0):
    """Ekstrudovan poligon: tačke (x, y) u Blender ravni, visina h od z0."""
    bm = bmesh.new()
    dole = [bm.verts.new((x, y, z0)) for x, y in tacke2d]
    gore = [bm.verts.new((x, y, z0 + h)) for x, y in tacke2d]
    bm.faces.new(dole[::-1]); bm.faces.new(gore)
    n = len(tacke2d)
    for i in range(n):
        j = (i + 1) % n
        bm.faces.new([dole[i], dole[j], gore[j], gore[i]])
    me = bpy.data.meshes.new(ime); bm.to_mesh(me); bm.free()
    ob = bpy.data.objects.new(ime, me)
    bpy.context.collection.objects.link(ob)
    return ob

def pravougaonik(x, y):
    return [(-x/2, -y/2), (x/2, -y/2), (x/2, y/2), (-x/2, y/2)]

def apsida_tacke(r, dubina, n=20):
    """Pravougaonik dubine `dubina` + polukrug r na +x strani."""
    t = [(-dubina, -r), (0, -r)]
    for i in range(1, n):
        a = -math.pi/2 + math.pi * i / n
        t.append((r * math.cos(a), r * math.sin(a)))
    t += [(0, r), (-dubina, r)]
    return t

def ngon(r, n, faza=0.0):
    return [(r*math.cos(2*math.pi*i/n + faza), r*math.sin(2*math.pi*i/n + faza)) for i in range(n)]

def gradi(el):
    D, obl = el["dim"], el["oblik"]
    h = 0 if el["tip"] == "teren" else max(
        el["visina_rek_m"] if REZIM == "rek" else el["visina_sacuvana_m"], 0.05)
    objekti = []
    if obl == "kutija":
        objekti.append(prizma(el["id"], pravougaonik(D["x"], D["z"]), h))
    elif obl == "prsten":
        tx = (D["spolja_x"] - D["unutra_x"]) / 2
        tz = (D["spolja_z"] - D["unutra_z"]) / 2
        for i, (sx, sy, px, py) in enumerate([
            (D["spolja_x"], tz, 0, -(D["unutra_z"] + tz) / 2),
            (D["spolja_x"], tz, 0,  (D["unutra_z"] + tz) / 2),
            (tx, D["unutra_z"], -(D["unutra_x"] + tx) / 2, 0),
            (tx, D["unutra_z"],  (D["unutra_x"] + tx) / 2, 0)]):
            o = prizma(f'{el["id"]}_{i}', [(x+px, y+py) for x, y in pravougaonik(sx, sy)], h)
            objekti.append(o)
    elif obl == "kolonada_prsten":
        vs = min(h, D["visina_stuba_m"])
        hx, hz, k, r = D["x"]/2 - 1, D["z"]/2 - 1, D["razmak_m"], D["precnik_stuba_m"]/2
        poz, x = [], -hx
        while x <= hx: poz += [(x, -hz), (x, hz)]; x += k
        z = -hz + k
        while z <= hz - k: poz += [(-hx, z), (hx, z)]; z += k
        for i, (px, py) in enumerate(poz):
            objekti.append(prizma(f'{el["id"]}_{i}', [(x+px, y+py) for x, y in ngon(r, 10)], vs))
    elif obl == "kolonada_dvoredna":
        r = D["precnik_m"] / 2
        vh = min(h, D.get("visina_m", h))
        dx, rx, rz = D["duzina_x"], D["razmak_x"], D["razmak_z"]
        n_stub = int(round(dx / rx)) + 1
        x_poc = -dx / 2
        for red_idx, z_offset in enumerate([-rz / 2, rz / 2]):
            for i in range(n_stub):
                px = x_poc + i * rx
                py = z_offset
                objekti.append(prizma(f'{el["id"]}_{red_idx}_{i}',
                    [(x + px, y + py) for x, y in ngon(r, 12)], vh))
    elif obl == "apsida":
        objekti.append(prizma(el["id"], apsida_tacke(D["r"], D["dubina"]), h))
    elif obl == "oktogon":
        objekti.append(prizma(el["id"], ngon(D["r"], 8, math.pi/8), h))
    elif obl == "bazilika":
        t = pravougaonik(D["x"], D["z"])
        objekti.append(prizma(el["id"], t, h))
        aps = [(x + D["x"]/2, y) for x, y in apsida_tacke(D["r_apside"], 0.1)]
        objekti.append(prizma(el["id"] + "_apsida", aps, h))
    elif obl == "cilindri_mreza":
        r, vh = D["precnik_m"]/2, D["visina_m"]
        for red in range(D["redova"]):
            for c in range(D["po_redu"]):
                px = -(D["po_redu"]-1)*3.2/2 + c*3.2
                py = -(D["redova"]-1)*4.5/2 + red*4.5
                objekti.append(prizma(f'{el["id"]}_{red}_{c}',
                    [(x+px, y+py) for x, y in ngon(r, 14)], vh, z0=-0.8))
    elif obl == "ravan":
        objekti.append(prizma(el["id"], pravougaonik(D["x"], D["z"]), 0.01, z0=-0.01))
    m = mat(el["pouzdanost"] if el["tip"] != "teren" else "teren_pod")
    if el["tip"] == "teren":
        m = bpy.data.materials.new("teren"); m.use_nodes = True
        m.node_tree.nodes["Principled BSDF"].inputs["Base Color"].default_value = (.16, .13, .10, 1)
    rot = math.radians(el.get("rot_deg", 0))
    for o in objekti:
        o.data.materials.append(m)
        # JSONL pos=[x,z] (Three.js) -> Blender (x, -z)
        o.location.x += el["pos"][0] * math.cos(rot) - 0  # rotacija oko centra elementa:
    # rotiramo grupno: parent empty
    emp = bpy.data.objects.new(el["id"] + "_grp", None)
    bpy.context.collection.objects.link(emp)
    emp.location = (el["pos"][0], -el["pos"][1], 0)
    emp.rotation_euler = (0, 0, -rot)
    for o in objekti:
        o.location = (o.location.x - el["pos"][0], o.location.y, o.location.z)
        o.parent = emp
    return objekti

def main():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    elementi = [el for el in jsonl(os.path.join(KOREN, "data", "GEOMETRIJA.jsonl")) if el.get("prikaz", True)]
    for el in elementi:
        gradi(el)
    # svetlo i kamera
    sunce = bpy.data.objects.new("sunce", bpy.data.lights.new("sunce", "SUN"))
    sunce.data.energy = 4; sunce.rotation_euler = (math.radians(50), 0, math.radians(-35))
    bpy.context.collection.objects.link(sunce)
    kam = bpy.data.objects.new("kamera", bpy.data.cameras.new("kamera"))
    kam.data.clip_end = 6000  # scena se renderuje sa ~1-2 km, podrazumevanih 100 m odseca sve
    # kamera iz ogranicavajuce kugle scene: cilj u centru, razmak iz FOV-a
    xs, ys = [], []
    for el in elementi:
        xs += [el["pos"][0] - el["dim"].get("x", el["dim"].get("spolja_x", 0)) / 2,
               el["pos"][0] + el["dim"].get("x", el["dim"].get("spolja_x", 0)) / 2]
        zs = el["dim"].get("z", el["dim"].get("spolja_z", 0))
        ys += [el["pos"][1] - zs / 2, el["pos"][1] + zs / 2]
    cx, cy = (min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2
    r = max(math.dist((cx, cy), (min(xs), min(ys))), math.dist((cx, cy), (max(xs), max(ys))))
    # objektiv 50 mm, senzor 36 mm, rezolucija 1600x900 -> vertikalni polu-ugao ~11.4 stepeni
    d = (r * 1.5) / math.tan(math.radians(11.4))
    smer = (0.45, 0.8, 0.95)
    nl = math.sqrt(sum(c * c for c in smer))
    kam.location = (cx + smer[0] / nl * d, cy + smer[1] / nl * d, smer[2] / nl * d)
    bpy.context.collection.objects.link(kam)
    cilj = bpy.data.objects.new("cilj", None)
    cilj.location = (cx, cy, 0)
    bpy.context.collection.objects.link(cilj)
    tr = kam.constraints.new("TRACK_TO")
    tr.target = cilj; tr.track_axis = "TRACK_NEGATIVE_Z"; tr.up_axis = "UP_Y"
    bpy.context.scene.camera = kam
    sc = bpy.context.scene
    sc.render.resolution_x, sc.render.resolution_y = 1600, 900
    sc.render.engine = "BLENDER_EEVEE_NEXT" if "BLENDER_EEVEE_NEXT" in \
        [e.identifier for e in bpy.types.RenderSettings.bl_rna.properties["engine"].enum_items] else "BLENDER_EEVEE"
    sc.world = bpy.data.worlds.new("svet"); sc.world.use_nodes = True
    sc.world.node_tree.nodes["Background"].inputs[0].default_value = (.015, .015, .02, 1)
    os.makedirs(os.path.join(KOREN, "modeli"), exist_ok=True)
    os.makedirs(os.path.join(KOREN, "assets"), exist_ok=True)
    bpy.ops.export_scene.gltf(filepath=os.path.join(KOREN, "modeli", "medijana.glb"))
    sc.render.filepath = os.path.join(KOREN, "assets", "blizanac-render.png")
    bpy.ops.render.render(write_still=True)
    print("GOTOVO: modeli/medijana.glb + assets/blizanac-render.png iz", len(elementi), "elemenata")

main()
