export interface Item{
    id: number;
    title: string;
    status: boolean;
    created_at: boolean;
    fk_user_id: number;
}

export interface Data{
    items: Item[];
    next_item_id: number;
}