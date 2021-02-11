type promise<'a> = Js.Promise.t<'a>
let promisify = (f, x) => x->f->Js.Promise.resolve
module type Storage = {
  type t
  type element
  let make: unit => t
  let insert: (t, element) => promise<unit>
  module Index: {
    type i
    type rules
    let make: (t, rules) => t
    let next: t => option<element>
  }
}

module MutableStackStorage: Storage = {
  type element = int
  type t = Belt.MutableStack.t<element>
  let make = Belt.MutableStack.make
  // Just join a discord and ask how to do this dipshit.
  let insert = (t, a) => t->Belt.MutableStack.push(a)->Js.Promise.resolve
  module Index = {
    type i = t
    type rules = unit
    let make = (x, ()) => x
    let next = Belt.MutableStack.pop
  }
}
