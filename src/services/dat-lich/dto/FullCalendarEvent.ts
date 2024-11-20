export interface FullCalendarEvent {
    id: string;
    title: string;
    display: string;
    start: Date;
    end?: Date;
    startStr: string;
    endStr?: string;
    groupId?: string;
    url?: string;
    backgroundColor: string;
    textColor: string;
    borderColor: string;
    resourceId: string;
}
