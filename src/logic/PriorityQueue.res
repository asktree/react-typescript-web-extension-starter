module type PriorityQueue = {
  type state
  type date
  type priority
  type element

  module type Element = {
    type content
    type t = {priority: priority, content: content, reviewHistory: list<date>}
  }

  let insert: element => state
  let peek: int => array<element>
  let history: unit => array<element>
}
