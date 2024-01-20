import { Component, OnInit } from '@angular/core';
import { film } from '../shared/films.model';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProgressLogModalComponent } from '../progress-log-modal/progress-log-modal.component';


@Component({
  selector: 'app-films',
  templateUrl: './films.component.html',
  styleUrls: ['./films.component.scss']
})

export class FilmsComponent implements OnInit {
  modalDialog: MatDialogRef<ProgressLogModalComponent> | undefined;
  filmGroup!: FormGroup;
  public movies: film[] = [];
  duration = '';
  dataSourceFilms = new MatTableDataSource<film>([]);

  displayedColumns: string[] = ['watched', 'name', 'progress', 'action'];
  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.movies = JSON.parse(localStorage.getItem('films') || '[]');
    this.setFilmDataSource(this.movies);
    this.initForm();
  }

  initForm(): void {
    this.filmGroup = new FormGroup({
      fname: new FormControl('', Validators.required),
      fhours: new FormControl('', Validators.required),
      fminutes: new FormControl('', Validators.required),
    });
  }

  /* It physically deletes all data from localStorage
  */
  deleteAll(): void {
    if(confirm('Are you sure you want to all the data? \nImportant note: If you do not have a backup, all data will be forever lost.')) {
      localStorage.clear();
      window.location.reload();
    }
  }

  setFilmInLocalStorage(films: film[]): void {
    localStorage.setItem('films' || '', JSON.stringify(films));
  }

  setFilmDataSource(films: film[]): void {
    this.dataSourceFilms = new MatTableDataSource<film>(films);
  }

  storeAndShowInTable(films: film[]): void {
    this.setFilmInLocalStorage(films);
    this.setFilmDataSource(films);
  }

  getListFromLocalStorage(): film[] {
    return JSON.parse(localStorage.getItem('films') || '[]');
  }

  /* It adds a new film to the end of the list
  */
  addFilm(): void {
    this.movies = this.getListFromLocalStorage();
    const newFilm: film = { 
      name: String(this.filmGroup.controls.fname.value),
      duration: (Number(this.filmGroup.controls.fhours.value)*60) + Number(this.filmGroup.controls.fminutes.value),
      progress: 0, watched: false, percent: 0};
    this.movies.push(newFilm);
    this.storeAndShowInTable(this.movies);
  }

  /* It modifies the percent and progress when a film is checked.
  *@param filmName The name of the film to update.
  *@para checked The value of the checkbox after the change.
  */
  updateFilm(filmName: string, checked: boolean): void {
    this.movies = this.getListFromLocalStorage();
    this.movies.forEach((film) => {
      if(film.name === filmName) {
        film.watched = checked;
        if(checked) {
          film.percent = 100;
          film.progress = film.duration;
        }
      }
    });
    this.storeAndShowInTable(this.movies);
  }

  /* It deletes one object from LocalStorage using the filter function.
  *@param name of the film to delete. 
  */
  deleteOne(name: string): void {
    if(confirm('Are you sure you want to delete the film "'+name +'"?')) {
      this.movies = this.getListFromLocalStorage();
      this.movies = this.movies.filter(item => item.name !== name);
      this.storeAndShowInTable(this.movies);
    }
  }

  /* It opens a modal to the progress Log component
  * @param movie The name of the film that will be updated in the modal.
  */
  recordProgress(movie: film): void {
    const alert = this.modalDialog = this.dialog.open(ProgressLogModalComponent, {
      data: movie,
    });

    alert.afterClosed().subscribe((movies: film[]) => {
      if(movies) {
        this.storeAndShowInTable(movies);
      }
    });
  }
}
