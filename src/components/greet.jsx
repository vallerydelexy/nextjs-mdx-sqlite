import styles from "./greet.module.css";

export function Greet({ name = "world" }) {
    return <div className={styles.div}>Hello, {name}!</div>;
  }
  