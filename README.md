# Stuff.js #

Simple JavaScript wrapper for window.localStorage

### How to use? ###

Create storage instance

```
var users = new Stuff('users')
// or
var users = Stuff.create('users')
// or
var users = Stuff('users')

```

Add an item


```
Stuff('users').add({firstName: "John", lastName: "Doe"})

// or if you already have Stuff instance
users.add({firstName: "John", lastName: "Doe"})
```

Adding an item returns unique id

```
console.log(users.add({firstName: "John", lastName: "Doe"}))  // "zSVJgbGG85iT"
```

Get an item by id

```
Stuff('users').get("zSVJgbGG85iT")
```

Remove an item with id

```
Stuff('users').remove("zSVJgbGG85iT")
```

Update an item

```
Stuff('users').update("zSVJgbGG85iT", { firstName: "John", lastName: "Nash" })
```

Map / Reduce / Filter / ForEach

```
var ghAccounts = Stuff('githubAccounts')

ghAccounts.add({ name: 'kevinsawicki', contribs: 12405, language: 'JavaScript' })
ghAccounts.add({ name: 'michalbe', contribs: 12264, language: 'JavaScript' })
ghAccounts.add({ name: 'taylorotwell', contribs: 7952, language: 'PHP' })
ghAccounts.add({ name: 'michaelklishin', contribs: 7580, language: 'Ruby' })
ghAccounts.add({ name: 'brianchandotcom', contribs: 7576, language: 'Java' })
ghAccounts.add({ name: 'qiangxue', contribs: 7165, language: 'PHP' })
ghAccounts.add({ name: 'fabpot', contribs: 6674, language: 'PHP' })
ghAccounts.add({ name: 'mitchellh', contribs: 6233, language: 'Ruby' })
ghAccounts.add({ name: 'cvrebert', contribs: 5872, language: 'JavaScript' })
ghAccounts.add({ name: 'substack', contribs: 5757, language: 'JavaScript' })

ghAccounts.forEach(function(id) {
  console.log(ghAccounts.get(id).name);
});

ghAccounts.map(function(id) {         // ['kevinsawicki', ..., 'substack']
  return ghAccounts.get(id).name;
});

ghAccounts.reduce(function(current, id) {
  var newAcc = ghAccounts.get(id)
  return acccount.contribs < current.contribs ? acccount : current
}, ghAccounts.first());

ghAccounts.filter(function(id) {
  return ghAccounts.get(id) > 10000;
})
.map(function(id) {
  return ghAccounts.get(id).name;
});                                   // ['kevinsawicki', 'michalbe']

ghAccounts.find(function(id) {
  return ghAccounts.get(id).name === 'substack';
});
```

Events example

```
var users = Stuff('users');

users.on('add', function(id, user) {
  console.log(id);
});

users.on('update', function(id, user, oldUser) {
  console.log(id, user, oldUser);
});

users.add({name: 'John'});
// will log this
// 'T5Yq3ey2Tp'
// 'T5Yq3ey2Tp { name: "John" } undefined'
```

### Events ###

* **"add"** (id, value)
* **"remove"** (id, value)
* **"update"** (id, value, previousValue)
* **"change"** (id, value, previousValue)
* **"clear"**
