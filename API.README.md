This API documentation describes what

    GET /
Renders `index.ejs` and shows it to a user.
Required parameters: none
Result: `index.ejs` as a render.

    POST /login
Allows a user to log in.
Required parameters: `name`, `password`
Result: `true` on successful login; `false` otherwise

    DELETE /delete-user
Deletes a user.
Required parameters: `name`, `password`
Result: `true` on successful delete; `false` otherwise

    PUT /update-user-info
Allows a user to update their username, password, or name.
Required parameters: `oldName`, `oldPassword`, `newName`, `newFirstName`, `newLastName`, `newPassword`
Result: `true` on successful edit; `false` otherwise

    POST /sign-up
Signs up a user.
Required parameters: `name`, `password`, `firstName`, `lastName`
Result: `true` on new user creation; `false` otherwise

    POST /step
Tracks one step.
Required parameters: `name`
Result: `true` on success, `false` otherwise

    POST /set-info
Allows a user to add height, stride length, and weight information.
Required parameters: `name`, `height`, `stride-length`, `weight`
Result: `true` on update, `false` otherwise

    POST /set-goal
Allows a user to set a goal.
Required parameters: `name`, `goalType` (can be `0`, `1`, or `2`), `goalValue`

    POST /get-goal
Gets a JSON object representing a user's current goal.
Required parameters: `name`

    POST /get-name
Get's the user's first and last name.
Required parameters: `name`

    POST /add-friend
Adds a friend.
Required parameters: `name`, `friendName`

    POST /get-friends
Returns all friend names.
Required parameters: `name`

    POST /should-display-data
Returns `true` if data should be displayed, `false` otherwise
Required parameters: `name`, `friendName`