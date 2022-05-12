const monsters = {
  Emby: {
    position: {
      x: 290,
      y: 325,
    },
    image: {
      src: "./img/embySprite.png",
    },
    frames: {
      max: 4,
      hold: 25,
    },
    animate: true,
    name: "Emby",
    skills: [skills.Tackle, skills.Fireball],
  },
  Draggle: {
    position: {
      x: 800,
      y: 100,
    },
    image: {
      src: "./img/draggleSprite.png",
    },
    frames: {
      max: 4,
      hold: 25,
    },
    animate: true,
    isEnemy: true,
    name: "Draggle",
    skills: [skills.Tackle, skills.Fireball],
  },
};
