export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  body: string;
}

export const posts: BlogPost[] = [
  {
    slug: "what-the-rust-book-doesnt-teach",
    title: "what the rust book doesn't teach",
    date: "2026-09-05",
    tags: ["rust", "learning"],
    excerpt: "a few deeper rust questions that make more sense after the fundamentals.",
    body: `the rust book is brilliant, but while learning rust i had a bunch of questions that simply weren't right to introduce from the get-go.

rust is infamous for being a "hard" language to learn, and withholding the introduction of certain concepts makes absolute sense. for me, however, i went ahead and studied things a bit deeper and want to share my learnings here. since i'm still a budding rustacean, i might make a few errors. if so, please feel free to correct me.

let's start with \`io::stdin()\`.

\`stdin()\` by itself does not and cannot read data. it creates an instance of \`stdin\`, which is a handle/controller and not data storage itself. user input from the terminal is passed to the os, which stores it in a system-level buffer. stdin can read from this buffer according to the written function. for example, if the written function is \`.read_line()\`:

\`io::stdin().read_line(&mut string)\` makes stdin read until a newline character (\`\\n\`) is encountered, and the newline is included in the read input.

while we are at \`.read_line()\`, it only accepts a mutable borrow as per its definition because its entire purpose is to append user input from the terminal to a placeholder. thus, passing immutable borrows results in a compilation error. similarly, you cannot pass a variable directly as an argument either because then you give up its ownership and it will be destroyed once the function completes its execution. in most such cases for scalar types like \`int\`, the value is simply copied instead (pass by value).

next up is cargo.

\`cargo.lock\` is not committed for library crates as it would be pointless. imagine your library locks a dependency to \`rand = "0.8.5"\`, and a developer imports your library, but their own application requires \`rand = "0.8.6"\`. if cargo respected your library's lockfile, it would be forced to download two different versions of the exact same library. this bloats the final file size and can cause severe compiler errors if data types from rand are passed between your library and their app.

an application needs stability while a library needs compatibility. when your library is used as a dependency, cargo ignores its lockfile and instead resolves semantic versioning such that one version satisfies every crate's \`cargo.toml\` requirements across the whole dependency tree.

another interesting fact i learned is that const expressions bound to a variable via a \`let\` declaration are evaluated at run-time, unlike those bound with a \`const\` declaration. for example:

\`const three_hours_in_seconds = 3 * 60 * 60;\` will be evaluated to 10,800 at compile-time and the value will be inlined wherever it is invoked, thus not consuming space on the stack (pasted in place wherever you mention it).

however, \`let three_hours_in_seconds = 3 * 60 * 60;\` will be evaluated at run-time and the variable will consume memory and thus have an address.

if you now borrow these values in separate variables such as:

\`\`\`rust
let borrow1 = &three_hours_in_seconds;
let borrow2 = &three_hours_in_seconds;
\`\`\`

and print their addresses for both cases, the let declaration will result in the same address being printed twice while the const declaration gives two different addresses, as it creates a temporary copy that consumes memory for each borrow.

const has a \`'static\` lifetime implicitly: a const reference is valid for the entire duration of the program. you can return it from a function without issues. on the other hand, let has a scoped lifetime: a let binding (even if immutable) lives only as long as the scope it was created in. if you try to return a reference to a let-bound value that goes out of scope, the compiler rejects it.

expressions in rust implicitly return the unit value if they don't return any other value. yes, \`println!\` also returns unit. therefore:

\`fn foo() {}\` is syntactic sugar for \`fn foo() -> () {}\`.

this applies to every function and every block expression that falls off the end without a final value. the one exception is diverging functions (explicit \`-> !\` return type) like \`panic!\`. those never return at all, so they don't return \`()\` either.

although conceptually it is a compound type too, \`string\` is classified as a collection because it is a growable type like vectors. under the hood, string is a struct with three fields: a pointer to the data on the heap, a capacity (total space allocated), and a length (how many bytes are currently in use).

string is growable, mutable, and an owned data structure. its metadata (pointer, capacity, and length) live in the stack and the data (utf-8 bytes) is stored in the heap. when string goes out of scope (stack pop), the heap memory is automatically freed — an example of how rust ensures memory safety at compile time.

\`&str\` (string slice) is an immutable reference to a sequence of utf-8 text bytes stored somewhere in memory. the data could be at either the stack or the heap or the compiled binary (a string literal). it is made up of a fat pointer (start address and a length) and only borrows data. the type of literal \`&str\` is \`&'static str\`. \`'static\` is the lifetime: the text will last for the entire duration of the program.

a pointer in rust is a one-word structure (4 bytes for 32-bit and 8 bytes for 64-bit architecture), whereas a fat pointer is a two-word structure which not only contains an address but also some metadata for context required by the compiler at runtime.

lastly, i also learned a bit about modules and module scope. we know that unlike c, rust doesn't require forward declarations for functions. but why?

rust doesn't care where you define your functions, only that they're defined somewhere in a scope that can be seen by the caller. the compiler does multiple passes over the whole module, which is why forward declarations are unnecessary unlike c, where the compiler traditionally worked top-to-bottom in a single pass.

rust doesn't have a single global namespace. every rust program is a tree of modules, each with its own set of visible names starting from the crate root, which is the \`main.rs\` or \`lib.rs\` file. the crate root is a source file that the rust compiler starts from and makes up the root module of your crate. when you have a single-file project with no \`mod\` declarations, the entire file is the root module.

top-level \`fn\` (defined directly in a \`.rs\` file or inside a \`mod\` block) is visible to all other items in that same module. children can see the contents of ancestors, but ancestors can only see \`pub\` items of children. for example:

\`\`\`rust
// this is the crate root module (main.rs)
mod utils {
    fn helper() { /* ... */ } // private to utils
    pub fn format_name() { /* ... */ } // visible outside utils
}

fn main() {
    utils::format_name(); // works because format_name is pub
    utils::helper(); // error because helper is private
}
\`\`\`

everything is private by default. an item lives in a module and only that module (plus its child modules) can see it. a child module can reach up to its parent (and grandparents, etc.) using \`super::\` or just the bare name. siblings can't see each other's private items.

when the compiler processes a module, it first collects all the item names defined in that module (functions, structs, use imports, etc.) into a lookup table. only after that does it type-check the bodies. so by the time it's checking main's body, it already knows \`another_function\` exists regardless of whether you wrote it above or below main, kind of like reading a book's index before reading.

a file is a module; a module can contain items and child modules. the root file is just the topmost node in that tree. any \`.rs\` file that you declare with the \`mod <name>;\` syntax is a module. one module maps to exactly one file. mod can be inline like above or external like \`mod garden;\` (not defining in the same place, just declaring) and then letting the compiler look for a \`garden.rs\` or \`garden/mod.rs\` file. the compiler looks for the file at a fixed path relative to the file containing the declaration, and the declaration lives in the parent, not in the child file.

similarly, the \`use\` statement is a shortcut. it doesn't grant access; it just gives you a shorter path. \`use utils::format_name;\` lets you write \`format_name()\` instead of \`utils::format_name()\`, but you still need the item to be \`pub\`. use creates a local alias so you don't have to type the full path every time. for example:

\`\`\`rust
use std::collections::HashMap;

fn main() {
    let mut map = HashMap::new(); // shorthand for std::collections::HashMap::new()
}
\`\`\`

use is a private shortcut within the current module. nobody outside can see that alias. \`pub use\` does the same thing plus it makes the name part of your module's public api.

so basically, a use statement lets you shorten what you have to type to invoke something to just the string after the last \`::\`.

additionally, if you end a function with a statement (end with a semicolon), it would by default return the unit type. so if your function expects an int but receives unit, a compilation error will occur.

that covers the first three chapters of the book. none of this changes how you'd write basic rust on the daily, but it's nice to know if you're a curious cat like me. this is just the beginning and it's only going to be more interesting from here, so follow along if you're also currently learning rust or are an experienced rustacean. if you spot an error, let me know — i'd love to correct it and learn from you!`,
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((post) => post.slug === slug);
}
