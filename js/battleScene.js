const battleBackgroundImage = new Image();
battleBackgroundImage.src = "./img/battleBackground.png";

const battleBackground = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  image: battleBackgroundImage,
});

let draggle;
let emby;
let renderedSprites;
let battleAnimationID;
let queue;

function initBattle() {
  document.querySelector("#userInterface").style.display = "block";
  document.querySelector("#dialogueBox").style.display = "none";
  document.querySelector("#enemyHealthBar").style.width = "100%";
  document.querySelector("#playerHealthBar").style.width = "100%";
  document.querySelector("#skillsBox").replaceChildren();

  draggle = new Monster(monsters.Draggle);
  emby = new Monster(monsters.Emby);
  renderedSprites = [draggle, emby];
  queue = [];

  emby.skills.forEach((skill) => {
    const button = document.createElement("button");
    button.classList.add("skill");
    button.innerHTML = skill.name;
    document.querySelector("#skillsBox").append(button);
  });

  //skills listeners
  document.querySelectorAll(".skill").forEach((skill) => {
    skill.addEventListener("click", (event) => {
      const selectedSkill = skills[event.currentTarget.innerHTML];

      //player cast skill
      emby.skill({
        skill: selectedSkill,
        recipient: draggle,
        renderedSprites,
      });

      if (draggle.health <= 0) {
        queue.push(() => {
          draggle.faint();
        });
        queue.push(() => {
          gsap.to("#overlappingDiv", {
            opacity: 1,
            onComplete: () => {
              cancelAnimationFrame(battleAnimationID);
              animate();
              document.querySelector("#userInterface").style.display = "none";
              gsap.to("#overlappingDiv", {
                opacity: 0,
              });
              battle.initiated = false;
              audio.map.play();
            },
          });
        });
      }

      //enemy cast skill
      const randomAttack =
        draggle.skills[Math.floor(Math.random() * draggle.skills.length)];

      queue.push(() => {
        draggle.skill({
          skill: randomAttack,
          recipient: emby,
          renderedSprites,
        });

        if (emby.health <= 0) {
          queue.push(() => {
            emby.faint();
          });
          queue.push(() => {
            gsap.to("#overlappingDiv", {
              opacity: 1,
              onComplete: () => {
                cancelAnimationFrame(battleAnimationID);
                animate();
                document.querySelector("#userInterface").style.display = "none";
                gsap.to("#overlappingDiv", {
                  opacity: 0,
                });
                battle.initiated = false;
                audio.map.play();
              },
            });
          });
        }
      });
    });
    skill.addEventListener("mouseenter", (event) => {
      const selectedSkill = skills[event.currentTarget.innerHTML];
      const skillType = document.querySelector("#skillType");
      skillType.innerHTML = selectedSkill.type;
      skillType.style.color = selectedSkill.color;
    });
    skill.addEventListener("mouseleave", () => {
      const skillType = document.querySelector("#skillType");
      skillType.innerHTML = "Skill Type";
      skillType.style.color = "black";
    });
  });
}

function animateBattle() {
  battleAnimationID = window.requestAnimationFrame(animateBattle);
  battleBackground.draw();

  renderedSprites.forEach((sprite) => {
    sprite.draw();
  });
}

animate();
// initBattle();
// animateBattle();

document.querySelector("#dialogueBox").addEventListener("click", (event) => {
  if (queue.length > 0) {
    queue[0]();
    queue.shift();
  } else event.currentTarget.style.display = "none";
});
