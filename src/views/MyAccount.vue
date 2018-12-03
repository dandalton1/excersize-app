<template>
  <div class="jumbotron">
    <h1>My Account</h1>
    <p>Here's some settings you can change.</p>
    <p>&nbsp;</p>
    <h2>Add More Information</h2>
    <p>In order to add a goal, you need some more information on your account.</p>
    <p>This is needed for calculations such as calculating calories or how far you walked.</p>
    <form name="add-more-info">
      <p>Height (in inches):</p>
      <input type="number" name="height">
      <p>Weight (in pounds):</p>
      <input type="number" name="weight">
      <p>Stride length (in inches):</p>
      <input type="number" name="stride-length">
      <p>&nbsp;</p>
      <input type="submit" class="btn btn-primary">
    </form>
    <p>&nbsp;</p>
    <p>&nbsp;</p>
    <h2>Reset your information</h2>
    <p>For your security, we're going to need your password again. This is because, well, you can also reset your password.</p>
    <form name="edit-account">
      <p>Old password:</p>
      <input type="password" name="old-password">
      <p>New password:</p>
      <input type="password" name="new-password">
      <p>New username:</p>
      <input type="text" name="userName">
      <p>First Name:</p>
      <input type="text" name="firstName">
      <p>Last Name:</p>
      <input type="text" name="lastName">
      <p>&nbsp;</p>
      <input type="submit" class="btn btn-primary" value="Update">
    </form>
    <p>&nbsp;</p>
    <p>&nbsp;</p>
    <h2>Delete Your Account</h2>
    <p>We're sorry to see you go... :'(</p>
    <p>Before you go, please, enter your password, one last time.</p>
    <form name="delete-account">
      <input type="password" name="password">
      <p>&nbsp;</p>
      <input type="submit" class="btn btn-danger" value="Delete Account">
    </form>
  </div>
</template>

<script>
export default {
    name: "my-account"
}
</script>
