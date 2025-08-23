import { ChevronRight } from "lucide-react";
import { ActiveLink, useFullPath } from "raviger";
import { Fragment, type ReactNode, useMemo, useState } from "react";

import { cn } from "../../../lib/utils";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../../components/ui/collapsible";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "../../../components/ui/sidebar";
import { Avatar } from "../../Common/avatar";

const isChildActive = (link: NavigationLink) => {
  if (!link.children) return false;
  const currentPath = window.location.pathname;
  return link.children.some((child) => currentPath.startsWith(child.url));
};

export interface NavigationLink {
  header?: string;
  headerIcon?: ReactNode;
  name: string;
  url: string;
  icon?: ReactNode;
  visibility?: boolean;
  children?: NavigationLink[];
}

export function NavMain({ links }: { links: NavigationLink[] }) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const fullPath = useFullPath();
  const fullPathMap = useMemo(
    () =>
      fullPath.split("/").reduce(
        (acc, part) => ({
          ...acc,
          [part]: true,
        }),
        {} as Record<string, boolean>,
      ),
    [fullPath],
  );

  return (
    <SidebarGroup>
      <SidebarMenu>
        {links
          .filter((link) => link.visibility !== false)
          .map((link) => (
            <Fragment key={link.name}>
              {link.children ? (
                isCollapsed ? (
                  <PopoverMenu link={link} />
                ) : (
                  <Collapsible
                    asChild
                    defaultOpen={isChildActive(link)}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          data-cy={`nav-${link.name.toLowerCase().replace(/\s+/g, "-")}`}
                          tooltip={link.name}
                          className="cursor-pointer hover:bg-gray-200 hover:text-green-700"
                        >
                          {link.icon ? (
                            link.icon
                          ) : (
                            <Avatar
                              name={link.name || "Link"}
                              className="size-6 -m-1 rounded-sm"
                            />
                          )}
                          <span className="group-data-[collapsible=icon]:hidden ml-1">
                            {link.name}
                          </span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub className="border-l border-gray-300">
                          {link.children.map((subItem) => (
                            <>
                              {subItem.header && (
                                <div className="flex items-center gap-2 mt-2">
                                  {subItem.headerIcon}
                                  <span className="text-gray-400 uppercase text-xs font-bold">
                                    {subItem.header}
                                  </span>
                                </div>
                              )}
                              <SidebarMenuSubItem key={subItem.name}>
                                <SidebarMenuSubButton
                                  asChild
                                  data-cy={`nav-${subItem.name.toLowerCase().replace(/\s+/g, "-")}`}
                                  className={
                                    "text-gray-600 transition font-normal hover:bg-gray-200 hover:text-green-700"
                                  }
                                >
                                    <ActiveLink
                                      href={subItem.url}
                                      className="w-full"
                                      activeClass={cn(
                                        subItem.url
                                          .split("/")
                                          .every((part) => fullPathMap[part]) &&
                                          "bg-white text-green-700 shadow",
                                      )}
                                      exactActiveClass="bg-white text-green-700 shadow"
                                    >
                                      {subItem.name}
                                    </ActiveLink>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            </>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                )
              ) : (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    tooltip={link.name}
                    className={
                      "text-gray-600 transition font-normal hover:bg-gray-200 hover:text-green-700"
                    }
                    data-cy={`nav-${link.name.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <ActiveLink
                      href={link.url}
                      activeClass="bg-white text-green-700 shadow-sm"
                      exactActiveClass="bg-white text-green-700 shadow-sm"
                    >
                      {link.icon ? (
                        link.icon
                      ) : (
                        <Avatar
                          name={link.name || "Link"}
                          className="size-6 -m-1 rounded-sm"
                        />
                      )}

                      <span className="group-data-[collapsible=icon]:hidden ml-1">
                        {link.name}
                      </span>
                    </ActiveLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </Fragment>
          ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

function PopoverMenu({ link }: { link: NavigationLink }) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <SidebarMenuButton
          tooltip={link.name}
          className={cn(
            "cursor-pointer hover:bg-gray-200 hover:text-green-700",
            {
              "bg-white text-green-700 shadow": isChildActive(link),
            },
          )}
        >
          {link.icon ? (
            link.icon
          ) : (
            <Avatar name={link.name || "name"} className="size-6 -m-1 rounded-sm" />
          )}
        </SidebarMenuButton>
      </PopoverTrigger>
      <PopoverContent
        side="right"
        align="start"
        className="w-48 p-1"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex flex-col gap-1">
          {link.children?.map((subItem) => (
            <span
              key={subItem.name}
              className="w-full rounded-md px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100"
              onClick={() => setOpen(false)}
            >
              <ActiveLink
                href={subItem.url}
                activeClass="bg-gray-100 text-green-700"
                exactActiveClass="bg-gray-100 text-green-700"
              >
                {subItem.name}
              </ActiveLink>
            </span>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
