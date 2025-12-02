import { create } from 'zustand';
import { produce } from 'immer';
import { Page, PageBlock } from '@/features/pages/types';

interface PageBuilderState {
    // Current page data
    currentPage: Page | null;
    pageBlocks: PageBlock[];
    selectedBlockId: string | null;
    currentLanguage: string;

    // History for undo/redo
    history: PageBlock[][];
    historyIndex: number;

    // UI state
    isPreviewMode: boolean;
    isDirty: boolean;

    // Actions
    setCurrentPage: (page: Page) => void;
    setPageBlocks: (blocks: PageBlock[]) => void;
    addBlock: (block: PageBlock) => void;
    updateBlock: (blockId: string, config: Record<string, any>) => void;
    removeBlock: (blockId: string) => void;
    duplicateBlock: (blockId: string) => void;
    reorderBlocks: (blocks: PageBlock[]) => void;
    selectBlock: (blockId: string | null) => void;

    // History
    undo: () => void;
    redo: () => void;
    canUndo: () => boolean;
    canRedo: () => boolean;
    saveToHistory: () => void;

    // Language
    setLanguage: (language: string) => void;

    // UI
    setPreviewMode: (isPreview: boolean) => void;
    setDirty: (isDirty: boolean) => void;

    // Reset
    reset: () => void;
}

export const usePageBuilderStore = create<PageBuilderState>((set, get) => ({
    currentPage: null,
    pageBlocks: [],
    selectedBlockId: null,
    currentLanguage: 'en',
    history: [[]],
    historyIndex: 0,
    isPreviewMode: false,
    isDirty: false,

    setCurrentPage: (page) => set({ currentPage: page }),

    setPageBlocks: (blocks) => {
        set({ pageBlocks: blocks, history: [blocks], historyIndex: 0, isDirty: false });
    },

    addBlock: (block) => {
        set(
            produce((state: PageBuilderState) => {
                state.pageBlocks.push(block);
                state.isDirty = true;
            })
        );
        get().saveToHistory();
    },

    updateBlock: (blockId, config) => {
        set(
            produce((state: PageBuilderState) => {
                const block = state.pageBlocks.find((b) => b.id === blockId);
                if (block) {
                    block.config = { ...block.config, ...config };
                    state.isDirty = true;
                }
            })
        );
        get().saveToHistory();
    },

    removeBlock: (blockId) => {
        set(
            produce((state: PageBuilderState) => {
                state.pageBlocks = state.pageBlocks.filter((b) => b.id !== blockId);
                if (state.selectedBlockId === blockId) {
                    state.selectedBlockId = null;
                }
                state.isDirty = true;
            })
        );
        get().saveToHistory();
    },

    duplicateBlock: (blockId) => {
        set(
            produce((state: PageBuilderState) => {
                const block = state.pageBlocks.find((b) => b.id === blockId);
                if (block) {
                    const newBlock: PageBlock = {
                        ...block,
                        id: `temp-${Date.now()}`,
                        order: block.order + 1,
                    };
                    state.pageBlocks.splice(block.order + 1, 0, newBlock);
                    // Update order for subsequent blocks
                    state.pageBlocks.forEach((b, index) => {
                        b.order = index;
                    });
                    state.isDirty = true;
                }
            })
        );
        get().saveToHistory();
    },

    reorderBlocks: (blocks) => {
        set({ pageBlocks: blocks, isDirty: true });
        get().saveToHistory();
    },

    selectBlock: (blockId) => set({ selectedBlockId: blockId }),

    saveToHistory: () => {
        const { pageBlocks, history, historyIndex } = get();
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(JSON.parse(JSON.stringify(pageBlocks)));
        set({ history: newHistory, historyIndex: newHistory.length - 1 });
    },

    undo: () => {
        const { history, historyIndex } = get();
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            set({
                pageBlocks: JSON.parse(JSON.stringify(history[newIndex])),
                historyIndex: newIndex,
                isDirty: true,
            });
        }
    },

    redo: () => {
        const { history, historyIndex } = get();
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            set({
                pageBlocks: JSON.parse(JSON.stringify(history[newIndex])),
                historyIndex: newIndex,
                isDirty: true,
            });
        }
    },

    canUndo: () => get().historyIndex > 0,
    canRedo: () => get().historyIndex < get().history.length - 1,

    setLanguage: (language) => set({ currentLanguage: language }),

    setPreviewMode: (isPreview) => set({ isPreviewMode: isPreview }),

    setDirty: (isDirty) => set({ isDirty }),

    reset: () =>
        set({
            currentPage: null,
            pageBlocks: [],
            selectedBlockId: null,
            currentLanguage: 'en',
            history: [[]],
            historyIndex: 0,
            isPreviewMode: false,
            isDirty: false,
        }),
}));
