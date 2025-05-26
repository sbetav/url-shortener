"use client";

import { LinkType } from "@/types";
import { FC, useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { IconCainLink3, IconSearch } from "@intentui/icons";
import Link from "next/link";
import { TextField } from "../ui/text-field";

interface UserLinksProps {
  links: LinkType[];
}

const UserLinks: FC<UserLinksProps> = ({ links }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLinks, setFilteredLinks] = useState<LinkType[]>(links);

  useEffect(() => {
    const query = searchQuery.toLowerCase().trim();

    const terms = query.split(/\s+/).filter(Boolean);

    const filtered = links.filter((link) => {
      const slug = link.slug.toLowerCase();
      const url = link.url.toLowerCase();

      return terms.every((term) => slug.includes(term) || url.includes(term));
    });

    setFilteredLinks(filtered);
  }, [searchQuery, links]);

  return (
    <div className="w-full space-y-5">
      <div>
        <TextField
          prefix={<IconSearch className="size-4" />}
          placeholder="Search by slug or URL"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e)}
          className="bg-neutral-950"
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
          {filteredLinks?.map((link) => (
            <Link
              key={link.id}
              href={`/links/${link.slug}`}
              className="border-border group w-full rounded-xl border bg-neutral-950 px-5 py-3 transition-all hover:bg-neutral-900"
            >
              <div className="flex w-full items-center justify-between">
                <p className="text-lg font-semibold tracking-tight">
                  {link.slug}
                </p>
                <IconCainLink3 className="text-muted-fg group-hover:text-primary size-5 transition-all" />
              </div>
              <p className="text-muted-fg mt-2 line-clamp-1 text-sm">
                {link.url}
              </p>
              <div className="mt-3 space-y-2 space-x-2">
                <Badge>100 clicks</Badge>
                <Badge intent="warning">Expires in 3 days</Badge>
              </div>
            </Link>
          ))}
        </section>
      )}
    </div>
  );
};

export default UserLinks;
