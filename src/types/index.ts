export interface DownloadFormData {
    date: string;
    rakId: string;
}

export interface HomeFormData {
    truckNumber: string;
    transporter: string;
    date: string;
    checklist: {
        item: string;
        isChecked: boolean;
    }[];
}