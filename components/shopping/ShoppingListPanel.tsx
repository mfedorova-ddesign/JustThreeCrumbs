"use client";

import {
  BuiltShoppingList,
  shoppingListAsPlainText,
  ShoppingListItem
} from "@/lib/shopping/list";
import { Copy, Download, ShoppingCart, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type ShoppingListPanelProps = {
  list: BuiltShoppingList;
  onClose: () => void;
  onCopy: (text: string) => void;
  onExportPdf: (list: BuiltShoppingList, checked: Set<string>) => void;
};

function listFingerprint(list: BuiltShoppingList): string {
  return list.sections.map((s) => s.items.map((i) => i.id).join(",")).join("|");
}

export function ShoppingListPanel({ list, onClose, onCopy, onExportPdf }: ShoppingListPanelProps) {
  const fingerprint = useMemo(() => listFingerprint(list), [list]);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    setCheckedIds(new Set());
  }, [fingerprint]);

  function toggleItem(id: string) {
    setCheckedIds((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const plainText = shoppingListAsPlainText(list, checkedIds);

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-black/45 p-0 sm:items-center sm:p-4 animate-[fadeIn_180ms_ease-out]"
      onClick={onClose}
    >
      <div
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-brand-border/90 bg-white shadow-2xl animate-[modalIn_220ms_cubic-bezier(0.16,1,0.3,1)] sm:rounded-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-brand-border/70 px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="size-5 text-brand-primary" strokeWidth={2} />
            <h2 className="text-[17px] font-semibold text-brand-text">Shopping list</h2>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Copy to clipboard"
              title="Copy to clipboard"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-brand-text/60 hover:bg-brand-bg"
              onClick={() => onCopy(plainText)}
            >
              <Copy className="size-4" strokeWidth={2} />
            </button>
            <button
              type="button"
              aria-label="Export PDF"
              title="Export PDF"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-brand-text/60 hover:bg-brand-bg"
              onClick={() => onExportPdf(list, checkedIds)}
            >
              <Download className="size-4" strokeWidth={2} />
            </button>
            <button
              type="button"
              aria-label="Close"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-brand-text/60 hover:bg-brand-bg"
              onClick={onClose}
            >
              <X className="size-5" strokeWidth={2} />
            </button>
          </div>
        </div>
        <div className="px-5 py-4">
          {list.sections.length === 0 ? (
            <p className="text-sm text-brand-text/60">No ingredients found in the current plan.</p>
          ) : (
            <div className="space-y-5">
              {list.sections.map((section) => (
                <div key={section.id}>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-brand-text/45">
                    {section.title}
                  </p>
                  <ul className="space-y-1">
                    {section.items.map((item) => (
                      <ShoppingListRow
                        key={item.id}
                        item={item}
                        checked={checkedIds.has(item.id)}
                        onToggle={() => toggleItem(item.id)}
                      />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ShoppingListRow({
  item,
  checked,
  onToggle
}: {
  item: ShoppingListItem;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <li>
      <label
        className={`flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2.5 text-[14px] odd:bg-brand-bg/60 ${
          checked ? "opacity-50" : ""
        }`}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={onToggle}
          className="mt-0.5 size-4 shrink-0 rounded border-brand-border text-brand-primary focus:ring-brand-primary/30"
        />
        <span className={`text-brand-text ${checked ? "line-through" : ""}`}>{item.label}</span>
      </label>
    </li>
  );
}
