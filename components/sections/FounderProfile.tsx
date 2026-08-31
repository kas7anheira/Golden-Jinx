import Image from "next/image";
import Link from "next/link";

import profilePhoto from "@/public/luis-castanheira-profissional.png";

import styles from "./founder-profile.module.css";

export default function FounderProfile() {
  return (
    <section className={styles.section} aria-labelledby="founder-profile-title">
      <div className={styles.inner}>
        <div className={styles.portraitWrap}>
          <Image
            className={styles.portrait}
            src={profilePhoto}
            alt="Retrato profissional de Luís Filipe Madeira Castanheira"
            sizes="(max-width: 760px) 92vw, 34vw"
          />
        </div>

        <div className={styles.copy}>
          <p className={styles.eyebrow}>Fundador · Perfil profissional</p>
          <h2 id="founder-profile-title">Luís Filipe Madeira Castanheira</h2>
          <p className={styles.role}>Economista e empresário</p>
          <p className={styles.description}>
            Fundador da Golden Jinx, com uma abordagem que reúne análise económica,
            investimento imobiliário e capacidade de execução em construção,
            remodelação e valorização de imóveis.
          </p>
          <blockquote>“Rigor antes do brilho.”</blockquote>
          <Link href="/luis-filipe-madeira-castanheira" className={styles.link}>
            Conhecer o perfil profissional <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
