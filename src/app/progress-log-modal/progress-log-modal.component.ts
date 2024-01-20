import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { film } from '../shared/films.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-progress-log-modal',
  templateUrl: './progress-log-modal.component.html',
  styleUrls: ['./progress-log-modal.component.scss']
})

export class ProgressLogModalComponent implements OnInit {
  progressGroup!: FormGroup;
  public movies: film[] = [];
  public film: film = {
    name: '',
    duration: 0,
    progress: 0,
    watched: false,
    percent: 0
  };

  constructor(
    public dialogRef: MatDialogRef<ProgressLogModalComponent>,
    @Inject(MAT_DIALOG_DATA) public movieObj: film
  ) { }

  ngOnInit(): void {
    this.progressGroup = new FormGroup({
      fprogress: new FormControl('', Validators.required),
    });
  }

  /* It fetches the list of films from LocalStorage
  * @returns film[] a list of the current films logged in LS
  */
  getListFromLocalStorage(): film[] {
    return JSON.parse(localStorage.getItem('films') || '[]');
  }

  /* It records the current progress and percentage into a ts object array.
  */
  record(): void {
    this.movies = this.getListFromLocalStorage();
    this.movies.forEach((film) => {
      if(film.name === this.movieObj.name) {
        film.progress = Number(this.progressGroup.controls.fprogress.value);
        film.percent = Math.round((Number(this.progressGroup.controls.fprogress.value) * 100) / this.movieObj.duration);
      }
    });
    this.dialogRef.close(this.movies);
  }

  /* It closes the modal
  */
  closeModal() {
    this.dialogRef.close();
  }
}
