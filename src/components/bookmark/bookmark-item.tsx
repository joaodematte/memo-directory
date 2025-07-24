'use client';

/* eslint-disable @next/next/no-img-element */
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { FileIcon } from 'lucide-react';
import { toast } from 'sonner';

import { CommandItem, CommandShortcut } from '@/components/cmdk';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger
} from '@/components/ui/context-menu';
import { Kbd } from '@/components/ui/kbd';
import { useGroup } from '@/contexts/group-context';
import { isValidWebColor } from '@/lib/color';
import { getHostname } from '@/lib/url';
import type { Bookmark } from '@/types';

dayjs.extend(relativeTime);

function getFaviconFromUrl(url: string, size: number) {
  return `https://www.google.com/s2/favicons?domain=${url}&sz=${size}`;
}

function ListItemText({ content, createdAt }: Omit<Bookmark, 'type'>) {
  const isColor = isValidWebColor(content);

  return (
    <>
      {isColor ? (
        <div className="size-4" style={{ backgroundColor: content }} />
      ) : (
        <FileIcon className="text-muted-foreground size-4" />
      )}
      <span className="max-w-xs truncate">{content}</span>
      <CommandShortcut>
        <Kbd className="w-8 not-in-data-[selected=true]:hidden">Ctrl</Kbd>
        <Kbd className="not-in-data-[selected=true]:hidden">C</Kbd>
      </CommandShortcut>
      <time className="text-muted-foreground shrink-0 text-xs in-data-[selected=true]:hidden">
        {dayjs(createdAt).fromNow()}
      </time>
    </>
  );
}

function ListItemUrl({ title, content, createdAt }: Omit<Bookmark, 'type'>) {
  return (
    <>
      <img
        src={getFaviconFromUrl(content, 24)}
        alt="Website's favicon"
        className="size-4"
      />
      <span className="max-w-xs truncate">{title}</span>
      <span className="text-muted-foreground max-w-64 truncate">
        {getHostname(content)}
      </span>
      <CommandShortcut>
        <Kbd className="w-8 not-in-data-[selected=true]:hidden">Ctrl</Kbd>
        <Kbd className="not-in-data-[selected=true]:hidden">C</Kbd>
      </CommandShortcut>
      <time className="text-muted-foreground shrink-0 text-xs in-data-[selected=true]:hidden">
        {dayjs(createdAt).fromNow()}
      </time>
    </>
  );
}

function MoveToGroupSub() {
  const { groups } = useGroup();

  return (
    <ContextMenuSub>
      <ContextMenuSubTrigger>Move to</ContextMenuSubTrigger>
      <ContextMenuSubContent>
        {groups.map(({ id, name, color }, index) => (
          <ContextMenuItem key={id}>
            <div
              className="size-4 rounded-full"
              style={{ backgroundColor: color }}
            />
            {name}
            <ContextMenuShortcut>
              <Kbd>{index + 1}</Kbd>
            </ContextMenuShortcut>
          </ContextMenuItem>
        ))}
      </ContextMenuSubContent>
    </ContextMenuSub>
  );
}

interface BookmarkItemProps extends Bookmark {
  toggleDeleteDialog: () => void;
}

export function BookmarkItem({
  toggleDeleteDialog,
  ...props
}: BookmarkItemProps) {
  const Content = props.type === 'url' ? ListItemUrl : ListItemText;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(props.content);

      toast.success('Content copied');
    } catch {
      console.error('Unable to write to clipboard');
    }
  };

  const handleDelete = () => {
    toggleDeleteDialog();
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger
        render={({ onSelect: _onSelect, ...triggerProps }) => (
          <CommandItem {...triggerProps}>
            <Content {...props} />
          </CommandItem>
        )}
      />
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuItem onClick={handleCopy}>
            Copy
            <ContextMenuShortcut>
              <Kbd>C</Kbd>
            </ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            Edit
            <ContextMenuShortcut>
              <Kbd>E</Kbd>
            </ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem onClick={handleDelete}>
            Delete
            <ContextMenuShortcut>
              <Kbd>D</Kbd>
            </ContextMenuShortcut>
          </ContextMenuItem>
          <MoveToGroupSub />
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
}
