import { Book } from '../book';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { BookService } from '../book.service';
import { FirebaseNode } from 'src/app/books/firebasenode';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})

export class BookListComponent {

  dataSource: MatTableDataSource<Book>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  BookData: any = [];
  displayedColumns: any[] = [
    '$key',
    'book_name',
    'author_name',
    'publication_date',
    'in_stock',
    'action'
  ];

  constructor(private bookApi: BookService,
              public dialog: MatDialog,
              private toastr: ToastrService) {
    this.bookApi.GetBookList()
    .snapshotChanges().subscribe((books: FirebaseNode[]) => {
      this.BookData = [];
      books.forEach((item: FirebaseNode) => {
          const a = (item.payload as any).toJSON();
          a.$key = item.key;
          this.BookData.push(a as Book);
        });
        /* Data table */
      this.dataSource = new MatTableDataSource(this.BookData);
        /* Pagination */
      setTimeout(() => {
          this.dataSource.paginator = this.paginator;
        }, 0);
    });
  }

  /* Delete */
  deleteBook(index: number, e) {
      const data = this.dataSource.data;
      data.splice((this.paginator.pageIndex * this.paginator.pageSize) + index, 1);
      this.dataSource.data = data;
      this.bookApi.DeleteBook(e.$key);
      this.dialog.closeAll();
      this.toastr.success('Successfully deleted');
  }

  showDeleteConfirmation(content, i: number, e) {
    this.dialog.open(content, {
      width: '350px',
      data: {index: i, payload: e}
    });
  }
}

