import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Comment } from '../model/comment'
import { EmitterService } from '../../emitter.service';
import { CommentService } from '../services/comment.service';

@Component({
    selector: 'comment-box',
    template: `
        <div class="panel panel-default">
            <div class="panel-heading">{{comment.author}}</div>
            <div class="panel-body">
                {{comment.text}}
            </div>
            <div class="panel-footer">
                <button class="btn btn-info" (click)="editComment()">edit</button>
                <button class="btn btn-danger" (click)="deleteComment(comment.id)">delete</button>
            </div>
        </div>
    `
})

export class CommentBoxComponent {
    constructor(
        private commentService: CommentService
    ) { }
    // Define input properties
    @Input() comment: Comment;
    @Input() listId: string;
    @Input() editId: string;

    editComment() {
        EmitterService.get(this.editId).emit(this.comment);
    }

    deleteComment(id: string) {
        this.commentService.removeComment(id).subscribe(
            comments => {
                EmitterService.get(this.listId).emit(comments);
            },
            err => {
                console.log(err);
            });
    }
}
