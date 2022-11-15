import { PropsWithChildren } from "react";
import Link from "next/link";
import styles from "./NavigationItem.module.scss";

export const NavigationItem = ({
  href,
  children,
}: PropsWithChildren<{ href: string }>) => (
  <Link href={href} className={styles.item}>
    {children}
  </Link>
);
