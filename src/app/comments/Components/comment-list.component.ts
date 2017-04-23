import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';


import { Comment } from '../model/comment';
import { CommentService } from '../services/comment.service';
import { EmitterService } from '../../emitter.service';

@Component({
    selector: 'comment-list',
    template: `
        <comment-box [editId]="editId" [listId]="listId" *ngFor="let comment of comments" [comment]="comment"></comment-box>
    `,

})

export class CommentListComponent implements OnInit, OnChanges {
    constructor(
        private commentService: CommentService
    ) { }

    comments: Comment[];

    @Input() listId: string;
    @Input() editId: string;

    loadComments() {
        this.commentService.getComments()
            .subscribe(
            comments => this.comments = comments,
            err => {
                console.log(err);
            });
    }

    ngOnInit() {
        this.loadComments()
    }


    ngOnChanges(changes: any) {
        EmitterService.get(this.listId).subscribe((comments: Comment[]) => { this.comments = comments });
    }

}
