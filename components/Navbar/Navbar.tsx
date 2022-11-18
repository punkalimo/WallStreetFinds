import React from 'react'
import styles from "./Navbar.module.scss";
import Link from 'next/link';

const Navbar = () => {
  return (
    <div className={styles.container}>
        <Link href="/"><h2>WALLSTREET FINDS</h2></Link>
        
        <ul>
            <Link href="/plans"><li>Plans</li></Link>
            <Link href="/screener"><li>Screener</li></Link>
            <Link href="/news"><li>News</li></Link>
            <Link href="/watchlist"><li>Watchlist</li></Link>
            <Link href="/portfolio"><li>Portfolio</li></Link>
        </ul>
        <div className={styles.buttonContainer}>
            <Link href="/login">Sign in</Link>
            <Link href="/sign-up"><button>Sign up</button></Link>
        </div>
    </div>
  )
}

export default Navbar