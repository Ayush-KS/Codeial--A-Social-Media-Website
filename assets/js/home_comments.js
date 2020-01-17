let noty = function(type, text) {
    new Noty({
        theme: 'relax',
        text: text,
        type: type,
        layout: 'topRight',
        timeout: 1500
    }).show();
    return;
}

let createComment = function() {
    let newCommentForm = $('.new-comment-form').toArray();

    for(let i = 0; i < newCommentForm.length; i++) {

        currNewCommentForm = $(newCommentForm[i]);
        
        $(newCommentForm[i]).submit(function(e) {

//            console.log("The " + i +"th form is submitted!");
            
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/comments/create',
                data: $(newCommentForm[i]).serialize(),
                success: function(data) {
                    let newComment = newCommentDom(data.data.comment);
                    let currPostId = data.data.comment.post;
                    $(`#post-${currPostId}>#post-comments-list>ul`).prepend(newComment);
                    deleteComment($(` .delete-comment-button`, newComment));
                    noty('success', 'Comment Added!');
                    // CHANGE :: enable the functionality of the toggle like button on the new comment
                    new ToggleLike($(' .toggle-like-button', newComment));
                    $('.comment-content').val("");
                },
                error: function(error) {
                    noty('error', 'Something went wrong :(');
                    console.log(error.responseText);
                }
            });
        });
    }
}

let newCommentDom = function(comment) {
//    console.log(comment._id);
    return $(`<li id="comment-${comment._id}">
    
        <small>
            <a class="delete-comment-button" href="/comments/destroy/${comment._id}">
                X
            </a>
        </small>    
        
    <p>
        ${comment.content}
    </p>
    <small>
        ${comment.user.name}
    </small>
    <small>
                            
        <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${comment._id}&type=Comment">
            0 Likes
        </a>
    
    </small>
</li>`)
}

let deleteComment = function(deleteLink) {
 
    $(deleteLink).click(function(e) {
        e.preventDefault();

        $.ajax({
            type: 'get',
            url: $(deleteLink).prop('href'),
            success: function(data) {
                noty('success', 'Comment Deleted!');
                $(`#comment-${data.data.comment_id}`).remove();
            }, 
            error: function(error) {
                noty('error', 'Something went wrong :(');
                console.log(error.responseText);
            }
        });

    });
}

let deleteButtons = $('.delete-comment-button');
for(deleteButton of deleteButtons) {
    deleteComment(deleteButton);
}

createComment();