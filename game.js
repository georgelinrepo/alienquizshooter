kaplay({
  width: 800,
  height: 600,
  letterbox: true,
  background: [0, 0, 20],
});

async function loadPacks() {
  const res = await fetch("assets/packs/index.json");
  const filenames = await res.json();
  const packs = await Promise.all(
    filenames.map(async (filename) => {
      const r = await fetch(`assets/packs/${filename}`);
      return r.json();
    })
  );
  return packs;
}

scene("title", () => {
  add([
    text("ALIEN QUIZ SHOOTER", { size: 32 }),
    pos(width() / 2, height() / 2),
    anchor("center"),
    color(255, 255, 0),
  ]);
});

go("title");
