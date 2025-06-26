"use client";

import { LinkType } from "@/types";
import { FC, useEffect, useState } from "react";
import { IconChevronLgDown, IconCirclePlus, IconSearch } from "@intentui/icons";
import { TextField } from "../ui/text-field";
import { Menu } from "../ui/menu";
import { Button } from "../ui/button";
import { Selection } from "react-aria-components";
import CustomLinkModal from "./CustomLinkModal";
import { User } from "@supabase/supabase-js";
import LinkCard from "./LinkCard";
import { Pagination } from "../ui/pagination";

interface UserLinksProps {
  links: LinkType[];
  user: User;
}

type SortOption =
  | "newest"
  | "oldest"
  | "most-clicks"
  | "least-clicks"
  | "expiring-soon";

const UserLinks: FC<UserLinksProps> = ({ links, user }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLinks, setFilteredLinks] = useState<LinkType[]>(
    links.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return 0;
    }),
  );
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(
    new Set(["newest"]),
  );

  const handleSortChange = (keys: Selection) => {
    setSelectedKeys(keys);
    const selectedKey = Array.from(keys)[0] as SortOption;
    setSortBy(selectedKey);
  };

  const sortOptions = [
    { id: "newest", label: "Newest first" },
    { id: "oldest", label: "Oldest first" },
    { id: "most-clicks", label: "Most clicks" },
    { id: "least-clicks", label: "Least clicks" },
    { id: "expiring-soon", label: "Expiring soon" },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const onOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  useEffect(() => {
    const query = searchQuery.toLowerCase().trim();
    const terms = query.split(/\s+/).filter(Boolean);

    const filtered = links.filter((link) => {
      const slug = link.slug.toLowerCase();
      const url = link.url.toLowerCase();

      return terms.every((term) => slug.includes(term) || url.includes(term));
    });

    // Split into pinned and unpinned
    const pinnedLinks = filtered.filter((link) => link.pinned);
    const unpinnedLinks = filtered.filter((link) => !link.pinned);

    // Sorting function
    const sortFn = (a: LinkType, b: LinkType) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "oldest":
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        case "most-clicks":
          return (b.clickCount || 0) - (a.clickCount || 0);
        case "least-clicks":
          return (a.clickCount || 0) - (b.clickCount || 0);
        case "expiring-soon":
          const aHasExp = !!a.expiration;
          const bHasExp = !!b.expiration;
          if (aHasExp && !bHasExp) return -1;
          if (!aHasExp && bHasExp) return 1;
          if (aHasExp && bHasExp) {
            return (
              new Date(a.expiration!).getTime() -
              new Date(b.expiration!).getTime()
            );
          }
          return 0;
        default:
          return 0;
      }
    };

    // Sort each group
    pinnedLinks.sort(sortFn);
    unpinnedLinks.sort(sortFn);

    // Concatenate pinned first
    setFilteredLinks([...pinnedLinks, ...unpinnedLinks]);
  }, [searchQuery, links, sortBy]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const totalPages = Math.ceil(filteredLinks.length / itemsPerPage);

  const paginatedLinks = filteredLinks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="w-full space-y-7">
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <div className="flex w-full items-center gap-3">
          <TextField
            aria-label="Search by slug or URL"
            prefix={<IconSearch className="size-4" />}
            placeholder="Search by slug or URL"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e)}
            className="bg-bg/20 w-full"
          />
          <Menu>
            <Button
              aria-label="Sort by"
              intent="outline"
              className="group whitespace-nowrap"
            >
              Sort by
              <IconChevronLgDown className="group-pressed:rotate-180 duration-200" />
            </Button>

            <Menu.Content
              selectionMode="single"
              selectedKeys={selectedKeys}
              onSelectionChange={handleSortChange}
              items={sortOptions}
            >
              {(item) => (
                <Menu.Item key={item.id} aria-label={item.label}>
                  <Menu.Label>{item.label}</Menu.Label>
                </Menu.Item>
              )}
            </Menu.Content>
          </Menu>
        </div>
        <Button
          aria-label="Create link"
          size="small"
          onPress={() => setIsOpen(true)}
          className="w-full sm:w-auto"
        >
          <IconCirclePlus />
          Create
        </Button>
        <CustomLinkModal
          user={user}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        />
      </div>
      {!filteredLinks?.length ? (
        <p className="text-muted-fg py-4 text-center">
          {links?.length
            ? "No links found"
            : "You haven't created any links yet."}
        </p>
      ) : (
        <section className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {paginatedLinks?.map((link) => {
            return <LinkCard key={link.id} link={link} />;
          })}
        </section>
      )}
      {filteredLinks?.length > itemsPerPage && (
        <div className="mt-4 flex justify-end">
          <Pagination>
            <Pagination.List>
              {totalPages > 2 && (
                <Pagination.Item
                  aria-label="First page"
                  segment="first"
                  isDisabled={currentPage === 1}
                  onAction={() => setCurrentPage(1)}
                />
              )}
              <Pagination.Item
                aria-label="Previous page"
                segment="previous"
                isDisabled={currentPage === 1}
                onAction={() => setCurrentPage((p) => Math.max(1, p - 1))}
              />
              {Array.from({ length: totalPages }, (_, i) => (
                <Pagination.Item
                  aria-label={`Page ${i + 1}`}
                  key={i + 1}
                  isCurrent={currentPage === i + 1}
                  onAction={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Pagination.Item>
              ))}
              <Pagination.Item
                aria-label="Next page"
                segment="next"
                isDisabled={currentPage === totalPages}
                onAction={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
              />
              {totalPages > 2 && (
                <Pagination.Item
                  aria-label="Last page"
                  segment="last"
                  isDisabled={currentPage === totalPages}
                  onAction={() => setCurrentPage(totalPages)}
                />
              )}
            </Pagination.List>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default UserLinks;
