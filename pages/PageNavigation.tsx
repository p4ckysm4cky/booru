import { rangeInclusive } from "../server/utility";
import Link from "next/link";
import { PropsWithChildren } from "react";
import { useRouter } from "next/router";

const PAGE_SPREAD = 2;

const LeftArrow = () => <>←</>;
const RightArrow = () => <>→</>;
const Ellipsis = () => <>…</>;

const NavigationItem = ({ children }: PropsWithChildren) => {
  return (
    <div
      style={{
        // Fixed width items.
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: "4rem",
      }}
    >
      {children}
    </div>
  );
};

export const PageNavigation = ({
  page,
  pages,
  params,
}: {
  page: number;
  pages: number;
  params?: { [_name: string]: string };
}) => {
  const router = useRouter();
  const start = Math.max(1, page - PAGE_SPREAD);
  const end = Math.min(page + PAGE_SPREAD, pages);

  const link = (page: number) => {
    return `/${router.pathname}?${new URLSearchParams({
      page: page.toString(),
      ...(params || {}),
    })}`;
  };

  return (
    <nav
      style={{
        margin: "2rem 0",
        display: "flex",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <NavigationItem>
        {start < page ? (
          <Link href={link(page - 1)}>
            <LeftArrow />
          </Link>
        ) : (
          <LeftArrow />
        )}
      </NavigationItem>
      {1 < start && (
        <NavigationItem>
          <Link href={link(1)}>1</Link>
        </NavigationItem>
      )}
      {1 < start - 1 && (
        <NavigationItem>
          <Ellipsis />
        </NavigationItem>
      )}
      {rangeInclusive(start, end).map((index) => (
        <NavigationItem key={index}>
          {index == page ? (
            <b>{index}</b>
          ) : (
            <Link href={link(index)}>{index}</Link>
          )}
        </NavigationItem>
      ))}
      {end + 1 < pages && (
        <NavigationItem>
          <Ellipsis />
        </NavigationItem>
      )}
      {end < pages && (
        <NavigationItem>
          <Link href={link(pages)}>{pages}</Link>
        </NavigationItem>
      )}
      <NavigationItem>
        {page < end ? (
          <Link href={link(page + 1)}>
            <RightArrow />
          </Link>
        ) : (
          <RightArrow />
        )}
      </NavigationItem>
    </nav>
  );
};
