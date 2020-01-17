{

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

    let createPost = function() {
        let newPostForm = $('#new-post-form');
        
        newPostForm.submit(function(e){
            e.preventDefault();
//            console.log(newPostForm.serialize());
            
            $.ajax({
                type: 'post',
                url: "/posts/create",
                data: newPostForm.serialize(),
                success: function(data) {
                    let newPost = newPostDom(data.data.post);
                    noty('success', 'Post Up!');
                    $('#posts-list-container>ul').prepend(newPost);
                    deletePost($(` .delete-post-button`, newPost));
                    createComment($(` .new-comment-form`, newPost));

                    // CHANGE :: enable the functionality of the toggle like button on the new post
                    new ToggleLike($(' .toggle-like-button', newPost));

                    $('#post-content').val("");
                },
                error: function(error) {
                    noty('error', 'Something went wrong :(');
                    console.log(error.responseText);
                }
            });
        });
    }

    //Method to create Post in DOM
    let newPostDom = function(post) {
        return $(`<li id="post-${post._id}">

            <small>
                <a class="delete-post-button" href="/posts/destroy/${post._id}">
                    X
                </a>
            </small>    

        <p id="post-content">
            ${post.content}
        </p>
        <br>
        <small>
            ${post.user.name}
        </small>

        <small>
                            
            <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${post._id}&type=Post">
                0 Likes
            </a>
        
        </small>
    
        <div id="post-comments">
        
                <form action="/comments/create" method="POST" class="new-comment-form">
                    <input type="text" name="content">
                    <input type="hidden" name="post" value="${post._id}">
                    <input type="submit" value="Add Comment">
                </form>
                
        </div>
        <div id="post-comments-list">
            <ul id="post-comments-${post._id}">
            
            </ul>
        </div>
    </li>`)
    }

    let deletePost = function(deleteLink) {

        $(deleteLink).click(function(e) {
//            console.log(deleteLink);
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data) {
                    noty('success', 'Post Deleted!');
                    $(`#post-${data.data.post_id}`).remove();
                }, 
                error: function(error) {
                    noty('error', 'Something went wrong :(');
                    console.log(error.responseText);
                }
            });
        });
    }

    let deleteButtons = $('.delete-post-button');
    for(deleteButton of deleteButtons) {
        deletePost(deleteButton);
//        console.log(deleteButtons);
    }

    createPost();
}