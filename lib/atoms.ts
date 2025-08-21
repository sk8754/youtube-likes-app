import { atom } from "jotai";

// タブコンポーネントの選択されているボタンの状態
export const selectedTabButton = atom(0);

// モバイル用サイドバーの状態
export const isActiveSidebarAtom = atom(false);

// clientSecretの状態(stripe決済用)
export const clientSecretAtom = atom<string | null>(null);

// superchatUIの状態
export const isOpenSuperChatUIAtom = atom(false);

// Livecommentのチャット入力フォームの状態
export const isViewChatAreaAtom = atom(true);

// superchatのメッセージの状態
export const inputSuperChatMessageAtom = atom("");

// superchatの金額の状態
export const inputAmountAtom = atom<string>("1000");
