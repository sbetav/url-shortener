"use client";

import { LinkType } from "@/types";
import { FC, useEffect, useState } from "react";
import {
  IconChevronLgDown,
  IconCirclePlus, IconSearch
} from "@intentui/icons";
import { TextField } from "../ui/text-field";
import { Menu } from "../ui/menu";
import { Button } from "../ui/button";
import { Selection } from "react-aria-components";
import CustomLinkModal from "./CustomLinkModal";
import { User } from "@supabase/supabase-js";
import LinkCard from "./LinkCard";

interface UserLinksProps {
  links: LinkType[];
  user: User;
}

type SortOption = "newest" | "oldest" | "most-clicks" | "least-clicks";

const UserLinks: FC<UserLinksProps> = ({ links, user }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLinks, setFilteredLinks] = useState<LinkType[]>(links);
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

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
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
        default:
          return 0;
      }
    });

    setFilteredLinks(sorted);
  }, [searchQuery, links, sortBy]);

  return (
    <div className="w-full space-y-7">
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <div className="flex w-full items-center gap-3">
          <TextField
            prefix={<IconSearch className="size-4" />}
            placeholder="Search by slug or URL"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e)}
            className="w-full bg-neutral-950"
          />
          <Menu>
            <Button intent="outline" className="group whitespace-nowrap">
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
                <Menu.Item key={item.id}>
                  <Menu.Label>{item.label}</Menu.Label>
                </Menu.Item>
              )}
            </Menu.Content>
          </Menu>
        </div>
        <Button
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
          {filteredLinks?.map((link) => <LinkCard key={link.id} link={link} />)}
        </section>
      )}
    </div>
  );
};

export default UserLinks;
