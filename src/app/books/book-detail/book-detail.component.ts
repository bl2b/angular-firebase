import { Component, OnInit, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MatDialog } from '@angular/material';
import { BookService } from '../book.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from 'src/app/books/book';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

export interface Language {
  name: string;
}

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  languageArray: Language[] = [];
  @ViewChild('chipList') chipList;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  selectedBindingType: string;
  bookForm: FormGroup;
  BindingType: any = ['Paperback', 'Case binding', 'Perfect binding', 'Saddle stitch binding', 'Spiral binding'];
  bookId = this.activatedRoute.snapshot.paramMap.get('id');

  constructor(
    public fb: FormBuilder,
    private bookApi: BookService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private location: Location,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    if (this.bookId) {
      this.bookApi.GetBook(this.bookId).valueChanges().subscribe(data => {
        this.languageArray = data.languages || [];
        this.bookForm = this.buildBookForm(data);
      });
    } else {
      this.bookApi.GetBookList();
      this.bookForm = this.buildBookForm({});
    }
  }

  /* Remove dynamic languages */
  remove(language: Language): void {
    const index = this.languageArray.indexOf(language);
    if (index >= 0) {
      this.languageArray.splice(index, 1);
      this.bookForm.markAsDirty();
    }
  }

  /* Reactive book form */
  buildBookForm(book: Book): FormGroup {
    return this.fb.group({
      book_name: [book.book_name || null, [Validators.required]],
      isbn_10: [book.isbn_10 || null, [Validators.required]],
      author_name: [book.author_name || null, [Validators.required]],
      publication_date: [book.publication_date || null, [Validators.required]],
      binding_type: [book.binding_type || null, [Validators.required]],
      in_stock: book.in_stock || 'Yes',
      languages: [this.languageArray]
    });
  }

  /* Get errors */
  public handleError = (controlName: string, errorName: string) => {
    return this.bookForm.controls[controlName].hasError(errorName);
  }

  /* Add dynamic languages */
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // Add language
    if ((value || '').trim() && this.languageArray.length < 5) {
      this.languageArray.push({ name: value.trim() });
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
    this.bookForm.markAsDirty();
  }

  /* Date */
  formatDate(e) {
    const convertDate = new Date(e.target.value).toISOString().substring(0, 10);
    this.bookForm.get('publication_date').setValue(convertDate, {
      onlyself: true
    });
  }

  /* Reset form */
  resetForm() {
    this.languageArray = [];
    this.bookForm.reset();
    Object.keys(this.bookForm.controls).forEach(key => {
      this.bookForm.controls[key].setErrors(null);
    });
  }

  /* Submit book */
  submitBook() {
    if (this.bookForm.valid && this.bookForm.dirty) {
      this.bookApi.AddBook(this.bookForm.value);
      this.resetForm();
      this.toastr.success('Successfully added');
    } else {
      this.toastr.warning('Please complete the required fields');
    }
  }

  updateBook() {
    if (this.bookForm.valid && this.bookForm.dirty) {
      this.bookApi.UpdateBook(this.bookId, this.bookForm.value);
      this.router.navigate(['book']);
      this.dialog.closeAll();
      this.toastr.success('Successfully updated');
    }
  }

  showUpdateDialog(content) {
    this.dialog.open(content, {
      width: '350px'
    });
  }

  goBack() {
    this.location.back();
  }
}
