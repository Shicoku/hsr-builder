export function starDraw(canvas: any, ctx: any, width: number, height: number, build: any, setImageUrl: any) {
  const loadImage = (src: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.src = src;
      img.onload = () => resolve(img);
      img.onerror = () => {
        console.error("読み込み失敗:", src);
        reject(new Error(`画像読み込み失敗: ${src}`));
      };
    });

  Promise.all([loadImage("/assets/back.png"), loadImage(build.icon), loadImage(build.element), loadImage(build.path), loadImage("/assets/front.png")])
    .then(([back, icon, element, path, front]) => {
      ctx.drawImage(back, 0, 0, width, height);
      ctx.drawImage(icon, 200, -90, icon.width / 1.5, icon.height / 1.5);
      ctx.drawImage(element, 160, 75, element.width / 5, element.height / 5);
      ctx.drawImage(path, 220, 79, path.width / 10, path.height / 10);
      ctx.drawImage(front, 0, 0, 1920, 1080);

      const statusIcons = build.status.map((s: any) => s.icon);
      return Promise.all(statusIcons.map((src: any) => loadImage(src)));
    })
    .then((statusImages) => {
      const inter = build.status.length === 11 ? 55 : build.status.length === 10 ? 60 : 65;

      statusImages.forEach((img, i) => {
        const s = build.status[i];

        ctx.drawImage(img, 40, 155 + i * inter, img.width / 2.3, img.height / 2.3);

        ctx.fillStyle = "#fff";
        ctx.font = '38px "Kaisei Tokumin';
        ctx.fillText(s.name, 95, 200 + i * inter);

        ctx.textAlign = "right";
        ctx.fillText(s.val, 470, 200 + i * inter);
        ctx.textAlign = "start";
      });

      if (!build.light_cone) return null;

      const lcIcon = build.light_cone.icon;
      const lcRarity = `https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/icon/deco/Rarity${build.light_cone.rarity}.png`;
      const lcAttrIcons = build.light_cone.attributes.map((a: any) => a.icon);

      return Promise.all([loadImage(lcIcon), loadImage(lcRarity), ...lcAttrIcons.map((src: any) => loadImage(src))]);
    })
    .then((lcImages) => {
      if (!lcImages) return;

      const [iconImg, rarityImg, ...attrImgs] = lcImages;

      ctx.drawImage(iconImg, 50, 810, 160.5, 199);

      const rarityX = build.light_cone.rarity === 3 ? -25 : build.light_cone.rarity === 4 ? -45 : -55;

      ctx.drawImage(rarityImg, rarityX, 950, rarityImg.width / 1.5, rarityImg.height / 1.5);

      ctx.font = '20px "Kaisei Tokumin';
      ctx.fillStyle = "#fff";
      ctx.fillText(build.light_cone.name, 250, 830);

      ctx.font = '35px "Kaisei Tokumin';
      ctx.fillText(`Lv. ${build.light_cone.level} R${build.light_cone.rank}`, 250, 880);

      attrImgs.forEach((img, i) => {
        const attr = build.light_cone.attributes[i];

        ctx.drawImage(img, 240, 880 + i * 40, img.width / 2.5, img.height / 2.5);

        ctx.font = '30px "Kaisei Tokumin';
        ctx.fillText(attr.name, 300, 920 + i * 40);

        ctx.textAlign = "right";
        ctx.fillText(attr.val, 470, 920 + i * 40);
        ctx.textAlign = "start";
      });

      const skillIcon = build.skill.map((a: any) => a.icon);
      return Promise.all([...skillIcon.map((src: any) => loadImage(src))]);
    })
    .then((skillImages) => {
      if (!skillImages) return;
      skillImages.forEach((img, i) => {
        const skill = build.skill[i];

        ctx.drawImage(img, 540, 220 + i * 150, img.width / 1.3, img.height / 1.3);
        ctx.font = '40px "Kaisei Tokumin';
        const level = skill.level.toString();
        const x = level.length === 1 ? 575 : 560;
        ctx.fillText(level, x, 355 + i * 150);
      });

      const rankIcon = build.rank_icons.map((a: any) => a.icon);
      const rankLockPromises = build.rank_icons.map((r: any) => (r.lock ? loadImage("/assets/back_icon.png") : Promise.resolve(null)));

      return Promise.all([...rankIcon.map((src: any) => loadImage(src)), ...rankLockPromises]);
    })
    .then((rankImages) => {
      if (!rankImages) return;
      const rankCount = build.rank_icons.length;
      const rankIconImgs = rankImages.slice(0, rankCount);
      const lockIconImgs = rankImages.slice(rankCount);

      rankIconImgs.forEach((img, i) => {
        ctx.drawImage(img, 1100, 130 + i * 150, img.width / 1.3, img.height / 1.3);
        const lockImg = lockIconImgs[i];
        if (lockImg) {
          ctx.drawImage(lockImg, 1100, 130 + i * 150, lockImg.width / 1.3, lockImg.height / 1.3);
        }
      });

      if (!build.relics) return null;
      const relicIconPaths = build.relics.map((r: any) => r.icon);
      const relicMainPaths = build.relics.map((r: any) => r.main_affix.icon);
      const relicRarityPaths = build.relics.map((r: any) => `https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/icon/deco/Rarity${r.rarity}.png`);

      const relicSubPaths = build.relics.flatMap((r: any) => r.sub_affix.map((s: any) => s.icon));

      return Promise.all([
        ...relicIconPaths.map((src: any) => loadImage(src)),
        ...relicMainPaths.map((src: any) => loadImage(src)),
        ...relicRarityPaths.map((src: any) => loadImage(src)),
        ...relicSubPaths.map((src: any) => loadImage(src)),
      ]);
    })
    .then((relicImages) => {
      if (!relicImages) return;

      const relicCount = build.relics.length;

      const relicIconImgs = relicImages.slice(0, relicCount);
      const relicMainImgs = relicImages.slice(relicCount, relicCount * 2);
      const relicRarityImgs = relicImages.slice(relicCount * 2, relicCount * 3);

      const relicSubImgs = relicImages.slice(relicCount * 3);

      let subIndex = 0;

      build.relics.forEach((relic: any, i: any) => {
        const relicIcon = relicIconImgs[i];
        ctx.drawImage(relicIcon, 1240, 55 + i * 170, relicIcon.width, relicIcon.height);

        ctx.fillRect(1530, 50 + i * 170, 5, 150);

        const mainIcon = relicMainImgs[i];
        ctx.drawImage(mainIcon, 1350, 70 + i * 170, mainIcon.width / 2.6, mainIcon.height / 2.6);

        ctx.font = "30px 'kt'";
        ctx.fillStyle = "#fff";
        ctx.fillText(relic.main_affix.name, 1400, 105 + i * 170);

        ctx.textAlign = "right";
        ctx.font = "40px 'kt'";
        ctx.fillText(relic.main_affix.dis, 1480, 155 + i * 170);
        ctx.textAlign = "start";

        const rarityImg = relicRarityImgs[i];
        ctx.drawImage(rarityImg, 1180, 140 + i * 170, rarityImg.width / 2, rarityImg.height / 2);

        ctx.font = "25px 'kt'";
        ctx.fillStyle = "#fff";
        ctx.fillText(`Lv. ${relic.level}`, 1430, 185 + i * 170);
        ctx.strokeStyle = "#fff";
        ctx.strokeText(`Lv. ${relic.level}`, 1430, 185 + i * 170);

        relic.sub_affix.forEach((sub: any, j: any) => {
          const img = relicSubImgs[subIndex++];

          ctx.drawImage(img, 1540, 50 + (i * 170 + j * 34), img.width / 2.7, img.height / 2.7);

          ctx.font = "25px 'kt'";
          ctx.fillStyle = "#fff";
          ctx.fillText(sub.name, 1590, 80 + (i * 170 + j * 34));

          ctx.textAlign = "right";
          ctx.fillText(sub.dis, 1765, 80 + (i * 170 + j * 34));
          ctx.strokeText(sub.dis, 1765, 80 + (i * 170 + j * 34));
          ctx.textAlign = "start";
        });
      });

      const relicSetIcons = build.relic_sets.map((r: any) => r.icon);
      return Promise.all(relicSetIcons.map((src: any) => loadImage(src)));
    })
    .then((relicSetImages) => {
      if (!relicSetImages) return;

      let startIndex = 0;

      if (build.relic_sets.length >= 2 && build.relic_sets[0].name === build.relic_sets[1].name) {
        startIndex = 1;
      }

      let point = 0;

      for (let i = startIndex; i < build.relic_sets.length; i++) {
        const img = relicSetImages[i];
        ctx.drawImage(img, 680 + point * 130, 820, 70, 70);
        ctx.fillStyle = "#fff";
        ctx.textAlign = "left";
        ctx.font = '30px "Kaisei Tokumin';
        ctx.fillText("x" + build.relic_sets[i].num, 750 + point * 130, 870);
        point++;
      }

      ctx.font = '60px "Kaisei Tokumin';
      ctx.fillStyle = "#fff";
      ctx.fillText(build.name, 40, 70);

      ctx.font = '35px "Kaisei Tokumin';
      ctx.fillStyle = "rgb(255, 255, 255)";
      ctx.fillText("Lv. " + build["level"], 45, 120);
      ctx.strokeStyle = "rgb(255, 255, 255)";
      ctx.strokeText("Lv. " + build["level"], 45, 120);

      ctx.font = '40px "Kaisei Tokumin';
      ctx.fillStyle = "rgb(255, 255, 255)";
      ctx.fillText("Total Score", 690, 950);
      ctx.font = '80px "Kaisei Tokumin';
      ctx.fillText(build.total_score.toString(), 700, 1030);
      ctx.strokeStyle = "rgb(255, 255, 255)";
      ctx.strokeText(build.total_score.toString(), 700, 1030);

      let scoreRank = "D";
      if (build["total_score"] >= 600) scoreRank = "SS";
      else if (build["total_score"] >= 540) scoreRank = "S";
      else if (build["total_score"] >= 360) scoreRank = "A";
      else if (build["total_score"] >= 240) scoreRank = "B";
      else if (build["total_score"] >= 60) scoreRank = "C";
      ctx.font = '130px "Kaisei Tokumin';
      ctx.fillText(scoreRank, 920, 1030);
      ctx.strokeStyle = "rgb(255, 255, 255)";
      ctx.strokeText(scoreRank, 920, 1030);

      if (build["relics"]) {
        for (let i = 0; i < build["relics"].length; i++) {
          ctx.fillRect(1780, 50 + i * 170, 5, 150);
          ctx.font = '30px "Kaisei Tokumin';
          ctx.fillStyle = "rgb(255, 255, 255)";
          ctx.fillText("Score", 1795, 90 + i * 170);
          ctx.strokeStyle = "rgb(255, 255, 255)";
          ctx.strokeText("Score", 1795, 90 + i * 170);
          ctx.font = '35px "Kaisei Tokumin';
          const relic = build.relics?.[i];
          ctx.fillText(relic.score, 1800, 130 + i * 170);
          ctx.strokeText(relic.score, 1800, 130 + i * 170);
          let scoreRank = "D";
          const score = Number(build.relics?.[i].score);
          if (score >= 100) scoreRank = "SS";
          else if (score >= 90) scoreRank = "S";
          else if (score >= 60) scoreRank = "A";
          else if (score >= 40) scoreRank = "B";
          else if (score >= 10) scoreRank = "C";
          ctx.fillText(scoreRank, 1830, 180 + i * 170);
          ctx.strokeText(scoreRank, 1830, 180 + i * 170);
        }
      }

      const url = canvas.toDataURL("image/png");
      setImageUrl(url);
    })
    .catch((e) => console.error(e));
}
