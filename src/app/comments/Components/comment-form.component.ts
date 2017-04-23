import { Component, EventEmitter, Input, OnChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs/Rx';

import { CommentBoxComponent } from './comment-box.component'
import { CommentService } from '../services/comment.service';
import { EmitterService } from '../../emitter.service';
import { Comment } from '../model/comment'

@Component({
    selector: 'comment-form',
    template: `
        <form (ngSubmit)="submitComment()">
            <div class="form-group">
                <div class="input-group">
                    <span class="input-group-addon" id="basic-addon1"><span class="glyphicon glyphicon-user"></span></span>
                    <input type="text" class="form-control" placeholder="Author" [(ngModel)]="model.author" name="author">
                </div>
                <br />
                <textarea class="form-control" rows="3" placeholder="Text" [(ngModel)]="model.text" name="text"></textarea>
                <br />
                <button *ngIf="!editing" type="submit" class="btn btn-primary btn-block">Add</button>
                <button *ngIf="editing" type="submit" class="btn btn-warning btn-block">Update</button>
            </div>
        </form>
    `,
    providers: [CommentService]
})

export class CommentFormComponent implements OnChanges {
    constructor(
        private commentService: CommentService
    ) { }

    private model = new Comment(new Date(), '', '');
    private editing = false;

    // Input properties
    @Input() editId: string;
    @Input() listId: string;


    submitComment() {
        let commentOperation: Observable<Comment[]>;

        if (!this.editing) {
            commentOperation = this.commentService.addComment(this.model)
        } else {
            commentOperation = this.commentService.updateComment(this.model)
        }

        // Subscribe to observable
        commentOperation.subscribe(
            comments => {
                EmitterService.get(this.listId).emit(comments);
                this.model = new Comment(new Date(), '', '');
                if (this.editing) this.editing = !this.editing;
            },
            err => {
                console.log(err);
            });
    }

    ngOnChanges() {
        EmitterService.get(this.editId).subscribe((comment: Comment) => {
            this.model = comment
            this.editing = true;
        });
    }
}
