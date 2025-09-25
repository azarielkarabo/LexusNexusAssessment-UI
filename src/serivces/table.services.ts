import { Injectable } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  public setPageEvent(pageEvent: PageEvent) {
    localStorage.setItem('mat.table.pageSize', pageEvent.pageSize.toString());
    localStorage.setItem('mat.table.currentPage', pageEvent.pageIndex.toString());
  }

  public getPageEvent(): PageEvent {
    const pageSize = Number(localStorage.getItem('mat.table.pageSize') ?? 10);
    const currentPage = Number(localStorage.getItem('mat.table.currentPage') ?? 1);

    const model = {
      pageSize,
      pageIndex: currentPage
    };
    return model as PageEvent;
  }
}