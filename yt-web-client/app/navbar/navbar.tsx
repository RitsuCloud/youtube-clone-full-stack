import Image from "next/image";
import styles from "./navbar.module.css"; 
import Link from "next/link";

export default function Navbar() {
    return (
        <nav className={styles.nav}>
            <Link href="/" className={styles.logoContainer}>
                <Image width={90} height={20} className={styles.logo}
                src="/youtube-logo.svg" alt="Youtube Logo"/> {/* we can just use / for this path is because it default look into public dir */}
            </Link>
        </nav>
    );
}