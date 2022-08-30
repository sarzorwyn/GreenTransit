var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames, __getOwnPropSymbols = Object.getOwnPropertySymbols, __getProtoOf = Object.getPrototypeOf, __hasOwnProp = Object.prototype.hasOwnProperty, __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: !0, configurable: !0, writable: !0, value }) : obj[key] = value, __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    __hasOwnProp.call(b, prop) && __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b))
      __propIsEnum.call(b, prop) && __defNormalProp(a, prop, b[prop]);
  return a;
};
var __markAsModule = (target) => __defProp(target, "__esModule", { value: !0 });
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    __hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0 && (target[prop] = source[prop]);
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source))
      exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop) && (target[prop] = source[prop]);
  return target;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: !0 });
}, __reExport = (target, module2, copyDefault, desc) => {
  if (module2 && typeof module2 == "object" || typeof module2 == "function")
    for (let key of __getOwnPropNames(module2))
      !__hasOwnProp.call(target, key) && (copyDefault || key !== "default") && __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  return target;
}, __toESM = (module2, isNodeMode) => __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", !isNodeMode && module2 && module2.__esModule ? { get: () => module2.default, enumerable: !0 } : { value: module2, enumerable: !0 })), module2), __toCommonJS = /* @__PURE__ */ ((cache) => (module2, temp) => cache && cache.get(module2) || (temp = __reExport(__markAsModule({}), module2, 1), cache && cache.set(module2, temp), temp))(typeof WeakMap != "undefined" ? /* @__PURE__ */ new WeakMap() : 0);

// <stdin>
var stdin_exports = {};
__export(stdin_exports, {
  assets: () => assets_manifest_default,
  assetsBuildDirectory: () => assetsBuildDirectory,
  entry: () => entry,
  publicPath: () => publicPath,
  routes: () => routes
});

// node_modules/@remix-run/dev/dist/compiler/shims/react.ts
var React = __toESM(require("react"));

// app/entry.server.tsx
var entry_server_exports = {};
__export(entry_server_exports, {
  default: () => handleRequest
});
var import_stream = require("stream"), import_server = require("react-dom/server"), import_react = require("@remix-run/react"), import_node = require("@remix-run/node"), import_isbot = __toESM(require("isbot")), ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext) {
  let callbackName = (0, import_isbot.default)(request.headers.get("user-agent")) ? "onAllReady" : "onShellReady";
  return new Promise((resolve, reject) => {
    let didError = !1, { pipe, abort } = (0, import_server.renderToPipeableStream)(/* @__PURE__ */ React.createElement(import_react.RemixServer, {
      context: remixContext,
      url: request.url
    }), {
      [callbackName]() {
        let body = new import_stream.PassThrough();
        responseHeaders.set("Content-Type", "text/html"), resolve(new import_node.Response(body, {
          status: didError ? 500 : responseStatusCode,
          headers: responseHeaders
        })), pipe(body);
      },
      onShellError(err) {
        reject(err);
      },
      onError(error) {
        didError = !0, console.error(error);
      }
    });
    setTimeout(abort, ABORT_DELAY);
  });
}

// app/root.tsx
var root_exports = {};
__export(root_exports, {
  default: () => App,
  links: () => links,
  loader: () => loader,
  meta: () => meta
});
var import_node3 = require("@remix-run/node"), import_react2 = require("@remix-run/react");

// app/styles/tailwind.css
var tailwind_default = "/build/_assets/tailwind-IRSUGBWM.css";

// app/session.server.ts
var import_node2 = require("@remix-run/node"), import_tiny_invariant = __toESM(require("tiny-invariant"));

// app/models/user.server.ts
var import_bcryptjs = __toESM(require("bcryptjs"));

// app/db.server.ts
var import_client = require("@prisma/client"), prisma;
global.__db__ || (global.__db__ = new import_client.PrismaClient()), prisma = global.__db__, prisma.$connect();

// app/models/user.server.ts
async function getUserById(id) {
  return prisma.user.findUnique({ where: { id } });
}
async function getUserByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}
async function createUser(email, password) {
  let hashedPassword = await import_bcryptjs.default.hash(password, 10);
  return prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword
        }
      }
    }
  });
}
async function verifyLogin(email, password) {
  let userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: !0
    }
  });
  if (!userWithPassword || !userWithPassword.password || !await import_bcryptjs.default.compare(password, userWithPassword.password.hash))
    return null;
  let _a = userWithPassword, { password: _password } = _a;
  return __objRest(_a, ["password"]);
}

// app/session.server.ts
(0, import_tiny_invariant.default)(process.env.SESSION_SECRET, "SESSION_SECRET must be set");
var sessionStorage = (0, import_node2.createCookieSessionStorage)({
  cookie: {
    name: "__session",
    httpOnly: !0,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: !1
  }
}), USER_SESSION_KEY = "userId";
async function getSession(request) {
  let cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}
async function getUserId(request) {
  return (await getSession(request)).get(USER_SESSION_KEY);
}
async function getUser(request) {
  let userId = await getUserId(request);
  if (userId === void 0)
    return null;
  let user = await getUserById(userId);
  if (user)
    return user;
  throw await logout(request);
}
async function requireUserId(request, redirectTo = new URL(request.url).pathname) {
  let userId = await getUserId(request);
  if (!userId) {
    let searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw (0, import_node2.redirect)(`/login?${searchParams}`);
  }
  return userId;
}
async function createUserSession({
  request,
  userId,
  remember,
  redirectTo
}) {
  let session = await getSession(request);
  return session.set(USER_SESSION_KEY, userId), (0, import_node2.redirect)(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: remember ? 60 * 60 * 24 * 7 : void 0
      })
    }
  });
}
async function logout(request) {
  let session = await getSession(request);
  return (0, import_node2.redirect)("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session)
    }
  });
}

// app/root.tsx
var links = () => [
  { rel: "stylesheet", href: tailwind_default },
  { rel: "preconnect", href: "https://fonts.gstatic.com", as: "style" },
  { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Alata&display=swap", as: "font" },
  { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Maven+Pro:wght@500&display=swap", as: "font" }
], meta = () => ({
  charset: "utf-8",
  title: "Remix Notes",
  viewport: "width=device-width,initial-scale=1"
});
async function loader({ request }) {
  return (0, import_node3.json)({
    user: await getUser(request)
  });
}
function App() {
  return /* @__PURE__ */ React.createElement("html", {
    lang: "en",
    className: "h-full"
  }, /* @__PURE__ */ React.createElement("head", null, /* @__PURE__ */ React.createElement(import_react2.Meta, null), /* @__PURE__ */ React.createElement(import_react2.Links, null)), /* @__PURE__ */ React.createElement("body", {
    className: "h-full"
  }, /* @__PURE__ */ React.createElement(import_react2.Outlet, null), /* @__PURE__ */ React.createElement(import_react2.ScrollRestoration, null), /* @__PURE__ */ React.createElement(import_react2.Scripts, null), /* @__PURE__ */ React.createElement(import_react2.LiveReload, null)));
}

// app/routes/healthcheck.tsx
var healthcheck_exports = {};
__export(healthcheck_exports, {
  loader: () => loader2
});
async function loader2({ request }) {
  let host = request.headers.get("X-Forwarded-Host") ?? request.headers.get("host");
  try {
    let url = new URL("/", `http://${host}`);
    return await Promise.all([
      prisma.user.count(),
      fetch(url.toString(), { method: "HEAD" }).then((r) => {
        if (!r.ok)
          return Promise.reject(r);
      })
    ]), new Response("OK");
  } catch (error) {
    return console.log("healthcheck \u274C", { error }), new Response("ERROR", { status: 500 });
  }
}

// app/routes/logout.tsx
var logout_exports = {};
__export(logout_exports, {
  action: () => action,
  loader: () => loader3
});
var import_node4 = require("@remix-run/node");
async function action({ request }) {
  return logout(request);
}
async function loader3() {
  return (0, import_node4.redirect)("/");
}

// app/routes/index.tsx
var routes_exports = {};
__export(routes_exports, {
  default: () => Index
});
var import_react5 = require("@remix-run/react");

// app/utils.ts
var import_react3 = require("@remix-run/react"), import_react4 = require("react"), DEFAULT_REDIRECT = "/";
function safeRedirect(to, defaultRedirect = DEFAULT_REDIRECT) {
  return !to || typeof to != "string" || !to.startsWith("/") || to.startsWith("//") ? defaultRedirect : to;
}
function useMatchesData(id) {
  let matchingRoutes = (0, import_react3.useMatches)(), route = (0, import_react4.useMemo)(() => matchingRoutes.find((route2) => route2.id === id), [matchingRoutes, id]);
  return route == null ? void 0 : route.data;
}
function isUser(user) {
  return user && typeof user == "object" && typeof user.email == "string";
}
function useOptionalUser() {
  let data = useMatchesData("root");
  if (!(!data || !isUser(data.user)))
    return data.user;
}
function useUser() {
  let maybeUser = useOptionalUser();
  if (!maybeUser)
    throw new Error("No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead.");
  return maybeUser;
}
function validateEmail(email) {
  return typeof email == "string" && email.length > 3 && email.includes("@");
}

// app/routes/index.tsx
function Index() {
  let user = useOptionalUser(), mainPageTransition = () => /* @__PURE__ */ React.createElement(import_react5.Link, {
    to: "maps"
  }, "test");
  return /* @__PURE__ */ React.createElement("div", {
    className: "bg-gray-50 flex h-screen justify-center items-center"
  }, /* @__PURE__ */ React.createElement("img", {
    src: "/images/winter-train.jpg",
    alt: "",
    className: "w-full h-full object-cover blur-md bg-black/30"
  }), /* @__PURE__ */ React.createElement("div", {
    className: "max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between absolute rounded-3xl shadow-lg bg-blue-100"
  }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", {
    className: " text-4xl font-bold tracking-tight text-gray-900 sm:text-4xl"
  }, /* @__PURE__ */ React.createElement("span", {
    className: "block text-gray-700"
  }, "Welcome to "), /* @__PURE__ */ React.createElement("span", {
    className: "text-green-500"
  }, "green"), /* @__PURE__ */ React.createElement("span", {
    className: "text-violet-500"
  }, "Transit")), /* @__PURE__ */ React.createElement("div", {
    className: "text-3xl  block font-light lg:py-2 text-gray-500"
  }, "Start your ", /* @__PURE__ */ React.createElement("span", {
    className: "text-green-500"
  }, " green journey"), " today.")), /* @__PURE__ */ React.createElement("div", {
    className: "mt-8 flex lg:mt-0 ml-12 lg:flex-shrink-0"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "inline-flex rounded-md shadow"
  }, /* @__PURE__ */ React.createElement("a", {
    href: "maps",
    className: "inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transform transition-all hover:scale-105"
  }, " Let's Go! ")), /* @__PURE__ */ React.createElement("div", {
    className: "ml-3 inline-flex rounded-md shadow"
  }, /* @__PURE__ */ React.createElement("a", {
    href: "#",
    className: "inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 transform transition-all hover:scale-105"
  }, " Learn more ")))));
}

// app/routes/login.tsx
var login_exports = {};
__export(login_exports, {
  action: () => action2,
  default: () => LoginPage,
  loader: () => loader4,
  meta: () => meta2
});
var import_node5 = require("@remix-run/node"), import_react6 = require("@remix-run/react"), React2 = __toESM(require("react"));
async function loader4({ request }) {
  return await getUserId(request) ? (0, import_node5.redirect)("/") : (0, import_node5.json)({});
}
async function action2({ request }) {
  let formData = await request.formData(), email = formData.get("email"), password = formData.get("password"), redirectTo = safeRedirect(formData.get("redirectTo"), "/notes"), remember = formData.get("remember");
  if (!validateEmail(email))
    return (0, import_node5.json)({ errors: { email: "Email is invalid", password: null } }, { status: 400 });
  if (typeof password != "string" || password.length === 0)
    return (0, import_node5.json)({ errors: { email: null, password: "Password is required" } }, { status: 400 });
  if (password.length < 8)
    return (0, import_node5.json)({ errors: { email: null, password: "Password is too short" } }, { status: 400 });
  let user = await verifyLogin(email, password);
  return user ? createUserSession({
    request,
    userId: user.id,
    remember: remember === "on",
    redirectTo
  }) : (0, import_node5.json)({ errors: { email: "Invalid email or password", password: null } }, { status: 400 });
}
var meta2 = () => ({
  title: "Login"
});
function LoginPage() {
  var _a, _b, _c, _d;
  let [searchParams] = (0, import_react6.useSearchParams)(), redirectTo = searchParams.get("redirectTo") || "/notes", actionData = (0, import_react6.useActionData)(), emailRef = React2.useRef(null), passwordRef = React2.useRef(null);
  return React2.useEffect(() => {
    var _a2, _b2, _c2, _d2;
    ((_a2 = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _a2.email) ? (_b2 = emailRef.current) == null || _b2.focus() : ((_c2 = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _c2.password) && ((_d2 = passwordRef.current) == null || _d2.focus());
  }, [actionData]), /* @__PURE__ */ React2.createElement("div", {
    className: "flex min-h-full flex-col justify-center"
  }, /* @__PURE__ */ React2.createElement("div", {
    className: "mx-auto w-full max-w-md px-8"
  }, /* @__PURE__ */ React2.createElement(import_react6.Form, {
    method: "post",
    className: "space-y-6"
  }, /* @__PURE__ */ React2.createElement("div", null, /* @__PURE__ */ React2.createElement("label", {
    htmlFor: "email",
    className: "block text-sm font-medium text-gray-700"
  }, "Email address"), /* @__PURE__ */ React2.createElement("div", {
    className: "mt-1"
  }, /* @__PURE__ */ React2.createElement("input", {
    ref: emailRef,
    id: "email",
    required: !0,
    autoFocus: !0,
    name: "email",
    type: "email",
    autoComplete: "email",
    "aria-invalid": ((_a = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _a.email) ? !0 : void 0,
    "aria-describedby": "email-error",
    className: "w-full rounded border border-gray-500 px-2 py-1 text-lg"
  }), ((_b = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _b.email) && /* @__PURE__ */ React2.createElement("div", {
    className: "pt-1 text-red-700",
    id: "email-error"
  }, actionData.errors.email))), /* @__PURE__ */ React2.createElement("div", null, /* @__PURE__ */ React2.createElement("label", {
    htmlFor: "password",
    className: "block text-sm font-medium text-gray-700"
  }, "Password"), /* @__PURE__ */ React2.createElement("div", {
    className: "mt-1"
  }, /* @__PURE__ */ React2.createElement("input", {
    id: "password",
    ref: passwordRef,
    name: "password",
    type: "password",
    autoComplete: "current-password",
    "aria-invalid": ((_c = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _c.password) ? !0 : void 0,
    "aria-describedby": "password-error",
    className: "w-full rounded border border-gray-500 px-2 py-1 text-lg"
  }), ((_d = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _d.password) && /* @__PURE__ */ React2.createElement("div", {
    className: "pt-1 text-red-700",
    id: "password-error"
  }, actionData.errors.password))), /* @__PURE__ */ React2.createElement("input", {
    type: "hidden",
    name: "redirectTo",
    value: redirectTo
  }), /* @__PURE__ */ React2.createElement("button", {
    type: "submit",
    className: "w-full rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
  }, "Log in"), /* @__PURE__ */ React2.createElement("div", {
    className: "flex items-center justify-between"
  }, /* @__PURE__ */ React2.createElement("div", {
    className: "flex items-center"
  }, /* @__PURE__ */ React2.createElement("input", {
    id: "remember",
    name: "remember",
    type: "checkbox",
    className: "h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
  }), /* @__PURE__ */ React2.createElement("label", {
    htmlFor: "remember",
    className: "ml-2 block text-sm text-gray-900"
  }, "Remember me")), /* @__PURE__ */ React2.createElement("div", {
    className: "text-center text-sm text-gray-500"
  }, "Don't have an account?", " ", /* @__PURE__ */ React2.createElement(import_react6.Link, {
    className: "text-blue-500 underline",
    to: {
      pathname: "/join",
      search: searchParams.toString()
    }
  }, "Sign up"))))));
}

// app/routes/notes.tsx
var notes_exports = {};
__export(notes_exports, {
  default: () => NotesPage,
  loader: () => loader5
});
var import_node6 = require("@remix-run/node"), import_react7 = require("@remix-run/react");

// app/models/note.server.ts
function getNote({
  id,
  userId
}) {
  return prisma.note.findFirst({
    select: { id: !0, body: !0, title: !0 },
    where: { id, userId }
  });
}
function getNoteListItems({ userId }) {
  return prisma.note.findMany({
    where: { userId },
    select: { id: !0, title: !0 },
    orderBy: { updatedAt: "desc" }
  });
}
function createNote({
  body,
  title,
  userId
}) {
  return prisma.note.create({
    data: {
      title,
      body,
      user: {
        connect: {
          id: userId
        }
      }
    }
  });
}
function deleteNote({
  id,
  userId
}) {
  return prisma.note.deleteMany({
    where: { id, userId }
  });
}

// app/routes/notes.tsx
async function loader5({ request }) {
  let userId = await requireUserId(request), noteListItems = await getNoteListItems({ userId });
  return (0, import_node6.json)({ noteListItems });
}
function NotesPage() {
  let data = (0, import_react7.useLoaderData)(), user = useUser();
  return /* @__PURE__ */ React.createElement("div", {
    className: "flex h-full min-h-screen flex-col"
  }, /* @__PURE__ */ React.createElement("header", {
    className: "flex items-center justify-between bg-slate-800 p-4 text-white"
  }, /* @__PURE__ */ React.createElement("h1", {
    className: "text-3xl font-bold"
  }, /* @__PURE__ */ React.createElement(import_react7.Link, {
    to: "."
  }, "Notes")), /* @__PURE__ */ React.createElement("p", null, user.email), /* @__PURE__ */ React.createElement(import_react7.Form, {
    action: "/logout",
    method: "post"
  }, /* @__PURE__ */ React.createElement("button", {
    type: "submit",
    className: "rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
  }, "Logout"))), /* @__PURE__ */ React.createElement("main", {
    className: "flex h-full bg-white"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "h-full w-80 border-r bg-gray-50"
  }, /* @__PURE__ */ React.createElement(import_react7.Link, {
    to: "new",
    className: "block p-4 text-xl text-blue-500"
  }, "+ New Note"), /* @__PURE__ */ React.createElement("hr", null), data.noteListItems.length === 0 ? /* @__PURE__ */ React.createElement("p", {
    className: "p-4"
  }, "No notes yet") : /* @__PURE__ */ React.createElement("ol", null, data.noteListItems.map((note) => /* @__PURE__ */ React.createElement("li", {
    key: note.id
  }, /* @__PURE__ */ React.createElement(import_react7.NavLink, {
    className: ({ isActive }) => `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`,
    to: note.id
  }, "\u{1F4DD} ", note.title))))), /* @__PURE__ */ React.createElement("div", {
    className: "flex-1 p-6"
  }, /* @__PURE__ */ React.createElement(import_react7.Outlet, null))));
}

// app/routes/notes/$noteId.tsx
var noteId_exports = {};
__export(noteId_exports, {
  CatchBoundary: () => CatchBoundary,
  ErrorBoundary: () => ErrorBoundary,
  action: () => action3,
  default: () => NoteDetailsPage,
  loader: () => loader6
});
var import_node7 = require("@remix-run/node"), import_react8 = require("@remix-run/react"), import_tiny_invariant2 = __toESM(require("tiny-invariant"));
async function loader6({ request, params }) {
  let userId = await requireUserId(request);
  (0, import_tiny_invariant2.default)(params.noteId, "noteId not found");
  let note = await getNote({ userId, id: params.noteId });
  if (!note)
    throw new Response("Not Found", { status: 404 });
  return (0, import_node7.json)({ note });
}
async function action3({ request, params }) {
  let userId = await requireUserId(request);
  return (0, import_tiny_invariant2.default)(params.noteId, "noteId not found"), await deleteNote({ userId, id: params.noteId }), (0, import_node7.redirect)("/notes");
}
function NoteDetailsPage() {
  let data = (0, import_react8.useLoaderData)();
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", {
    className: "text-2xl font-bold"
  }, data.note.title), /* @__PURE__ */ React.createElement("p", {
    className: "py-6"
  }, data.note.body), /* @__PURE__ */ React.createElement("hr", {
    className: "my-4"
  }), /* @__PURE__ */ React.createElement(import_react8.Form, {
    method: "post"
  }, /* @__PURE__ */ React.createElement("button", {
    type: "submit",
    className: "rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
  }, "Delete")));
}
function ErrorBoundary({ error }) {
  return console.error(error), /* @__PURE__ */ React.createElement("div", null, "An unexpected error occurred: ", error.message);
}
function CatchBoundary() {
  let caught = (0, import_react8.useCatch)();
  if (caught.status === 404)
    return /* @__PURE__ */ React.createElement("div", null, "Note not found");
  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}

// app/routes/notes/index.tsx
var notes_exports2 = {};
__export(notes_exports2, {
  default: () => NoteIndexPage
});
var import_react9 = require("@remix-run/react");
function NoteIndexPage() {
  return /* @__PURE__ */ React.createElement("p", null, "No note selected. Select a note on the left, or", " ", /* @__PURE__ */ React.createElement(import_react9.Link, {
    to: "new",
    className: "text-blue-500 underline"
  }, "create a new note."));
}

// app/routes/notes/new.tsx
var new_exports = {};
__export(new_exports, {
  action: () => action4,
  default: () => NewNotePage
});
var import_node8 = require("@remix-run/node"), import_react10 = require("@remix-run/react"), React3 = __toESM(require("react"));
async function action4({ request }) {
  let userId = await requireUserId(request), formData = await request.formData(), title = formData.get("title"), body = formData.get("body");
  if (typeof title != "string" || title.length === 0)
    return (0, import_node8.json)({ errors: { title: "Title is required", body: null } }, { status: 400 });
  if (typeof body != "string" || body.length === 0)
    return (0, import_node8.json)({ errors: { title: null, body: "Body is required" } }, { status: 400 });
  let note = await createNote({ title, body, userId });
  return (0, import_node8.redirect)(`/notes/${note.id}`);
}
function NewNotePage() {
  var _a, _b, _c, _d, _e, _f;
  let actionData = (0, import_react10.useActionData)(), titleRef = React3.useRef(null), bodyRef = React3.useRef(null);
  return React3.useEffect(() => {
    var _a2, _b2, _c2, _d2;
    ((_a2 = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _a2.title) ? (_b2 = titleRef.current) == null || _b2.focus() : ((_c2 = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _c2.body) && ((_d2 = bodyRef.current) == null || _d2.focus());
  }, [actionData]), /* @__PURE__ */ React3.createElement(import_react10.Form, {
    method: "post",
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8,
      width: "100%"
    }
  }, /* @__PURE__ */ React3.createElement("div", null, /* @__PURE__ */ React3.createElement("label", {
    className: "flex w-full flex-col gap-1"
  }, /* @__PURE__ */ React3.createElement("span", null, "Title: "), /* @__PURE__ */ React3.createElement("input", {
    ref: titleRef,
    name: "title",
    className: "flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose",
    "aria-invalid": ((_a = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _a.title) ? !0 : void 0,
    "aria-errormessage": ((_b = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _b.title) ? "title-error" : void 0
  })), ((_c = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _c.title) && /* @__PURE__ */ React3.createElement("div", {
    className: "pt-1 text-red-700",
    id: "title-error"
  }, actionData.errors.title)), /* @__PURE__ */ React3.createElement("div", null, /* @__PURE__ */ React3.createElement("label", {
    className: "flex w-full flex-col gap-1"
  }, /* @__PURE__ */ React3.createElement("span", null, "Body: "), /* @__PURE__ */ React3.createElement("textarea", {
    ref: bodyRef,
    name: "body",
    rows: 8,
    className: "w-full flex-1 rounded-md border-2 border-blue-500 py-2 px-3 text-lg leading-6",
    "aria-invalid": ((_d = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _d.body) ? !0 : void 0,
    "aria-errormessage": ((_e = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _e.body) ? "body-error" : void 0
  })), ((_f = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _f.body) && /* @__PURE__ */ React3.createElement("div", {
    className: "pt-1 text-red-700",
    id: "body-error"
  }, actionData.errors.body)), /* @__PURE__ */ React3.createElement("div", {
    className: "text-right"
  }, /* @__PURE__ */ React3.createElement("button", {
    type: "submit",
    className: "rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
  }, "Save")));
}

// app/routes/join.tsx
var join_exports = {};
__export(join_exports, {
  action: () => action5,
  default: () => Join,
  loader: () => loader7,
  meta: () => meta3
});
var import_node9 = require("@remix-run/node"), import_react11 = require("@remix-run/react"), React4 = __toESM(require("react"));
async function loader7({ request }) {
  return await getUserId(request) ? (0, import_node9.redirect)("/") : (0, import_node9.json)({});
}
async function action5({ request }) {
  let formData = await request.formData(), email = formData.get("email"), password = formData.get("password"), redirectTo = safeRedirect(formData.get("redirectTo"), "/");
  if (!validateEmail(email))
    return (0, import_node9.json)({ errors: { email: "Email is invalid", password: null } }, { status: 400 });
  if (typeof password != "string" || password.length === 0)
    return (0, import_node9.json)({ errors: { email: null, password: "Password is required" } }, { status: 400 });
  if (password.length < 8)
    return (0, import_node9.json)({ errors: { email: null, password: "Password is too short" } }, { status: 400 });
  if (await getUserByEmail(email))
    return (0, import_node9.json)({
      errors: {
        email: "A user already exists with this email",
        password: null
      }
    }, { status: 400 });
  let user = await createUser(email, password);
  return createUserSession({
    request,
    userId: user.id,
    remember: !1,
    redirectTo
  });
}
var meta3 = () => ({
  title: "Sign Up"
});
function Join() {
  var _a, _b, _c, _d;
  let [searchParams] = (0, import_react11.useSearchParams)(), redirectTo = searchParams.get("redirectTo") ?? void 0, actionData = (0, import_react11.useActionData)(), emailRef = React4.useRef(null), passwordRef = React4.useRef(null);
  return React4.useEffect(() => {
    var _a2, _b2, _c2, _d2;
    ((_a2 = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _a2.email) ? (_b2 = emailRef.current) == null || _b2.focus() : ((_c2 = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _c2.password) && ((_d2 = passwordRef.current) == null || _d2.focus());
  }, [actionData]), /* @__PURE__ */ React4.createElement("div", {
    className: "flex min-h-full flex-col justify-center"
  }, /* @__PURE__ */ React4.createElement("div", {
    className: "mx-auto w-full max-w-md px-8"
  }, /* @__PURE__ */ React4.createElement(import_react11.Form, {
    method: "post",
    className: "space-y-6"
  }, /* @__PURE__ */ React4.createElement("div", null, /* @__PURE__ */ React4.createElement("label", {
    htmlFor: "email",
    className: "block text-sm font-medium text-gray-700"
  }, "Email address"), /* @__PURE__ */ React4.createElement("div", {
    className: "mt-1"
  }, /* @__PURE__ */ React4.createElement("input", {
    ref: emailRef,
    id: "email",
    required: !0,
    autoFocus: !0,
    name: "email",
    type: "email",
    autoComplete: "email",
    "aria-invalid": ((_a = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _a.email) ? !0 : void 0,
    "aria-describedby": "email-error",
    className: "w-full rounded border border-gray-500 px-2 py-1 text-lg"
  }), ((_b = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _b.email) && /* @__PURE__ */ React4.createElement("div", {
    className: "pt-1 text-red-700",
    id: "email-error"
  }, actionData.errors.email))), /* @__PURE__ */ React4.createElement("div", null, /* @__PURE__ */ React4.createElement("label", {
    htmlFor: "password",
    className: "block text-sm font-medium text-gray-700"
  }, "Password"), /* @__PURE__ */ React4.createElement("div", {
    className: "mt-1"
  }, /* @__PURE__ */ React4.createElement("input", {
    id: "password",
    ref: passwordRef,
    name: "password",
    type: "password",
    autoComplete: "new-password",
    "aria-invalid": ((_c = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _c.password) ? !0 : void 0,
    "aria-describedby": "password-error",
    className: "w-full rounded border border-gray-500 px-2 py-1 text-lg"
  }), ((_d = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _d.password) && /* @__PURE__ */ React4.createElement("div", {
    className: "pt-1 text-red-700",
    id: "password-error"
  }, actionData.errors.password))), /* @__PURE__ */ React4.createElement("input", {
    type: "hidden",
    name: "redirectTo",
    value: redirectTo
  }), /* @__PURE__ */ React4.createElement("button", {
    type: "submit",
    className: "w-full rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
  }, "Create Account"), /* @__PURE__ */ React4.createElement("div", {
    className: "flex items-center justify-center"
  }, /* @__PURE__ */ React4.createElement("div", {
    className: "text-center text-sm text-gray-500"
  }, "Already have an account?", " ", /* @__PURE__ */ React4.createElement(import_react11.Link, {
    className: "text-blue-500 underline",
    to: {
      pathname: "/login",
      search: searchParams.toString()
    }
  }, "Log in"))))));
}

// app/routes/maps.tsx
var maps_exports = {};
__export(maps_exports, {
  default: () => Maps,
  libraries: () => libraries,
  links: () => links2,
  loader: () => loader8
});
var import_react12 = require("@headlessui/react"), import_react_map_gl = __toESM(require("react-map-gl")), import_react13 = require("@remix-run/react"), import_react14 = require("react"), import_polyline = require("@mapbox/polyline"), import_mapbox_gl = __toESM(require("mapbox-gl"));

// app/components/stats-window.tsx
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
function StatsWindow(props) {
  let categories = [
    {
      id: "Fastest",
      comparator: "durationSeconds"
    },
    {
      id: "Least Carbon Footprint",
      comparator: "carbonGrams"
    }
  ], parseDistance = (distanceMeters, rank) => distanceMeters == null || distanceMeters == 0 ? getColors("- km", void 0) : distanceMeters < 1e3 ? getColors(distanceMeters.toFixed(0) + " m", rank) : getColors((distanceMeters / 1e3).toFixed(1) + " km", rank), parseDuration = (durationSeconds, rank) => durationSeconds == null || durationSeconds == 0 ? getColors("- min", void 0) : durationSeconds <= 60 ? getColors(1 + " min", rank) : durationSeconds < 3600 ? getColors((durationSeconds / 60).toFixed(0) + " min", rank) : getColors((durationSeconds / 3600).toFixed(0) + " h " + (durationSeconds % 3600 / 60).toFixed(0) + " min", rank), parseCarbon = (carbonGrams, rank) => carbonGrams == null || carbonGrams == 0 ? getColors("- kg", void 0) : carbonGrams < 10 ? getColors("Negligible", rank) : getColors((carbonGrams / 1e3).toPrecision(3) + " kg", rank), getColors = (text, rank) => {
    switch (rank) {
      case 0:
        return /* @__PURE__ */ React.createElement("span", {
          className: "text-green-500"
        }, text);
      case 1:
        return /* @__PURE__ */ React.createElement("span", {
          className: "text-yellow-500"
        }, text);
      case 2:
        return /* @__PURE__ */ React.createElement("span", {
          className: "text-orange-500"
        }, text);
      case 3:
        return /* @__PURE__ */ React.createElement("span", {
          className: "text-red-500"
        }, text);
      default:
        return /* @__PURE__ */ React.createElement("span", {
          className: "text-gray-400"
        }, text);
    }
  };
  return /* @__PURE__ */ React.createElement("div", {
    className: classNames("rounded-xl bg-gray-200 p-4", "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2")
  }, /* @__PURE__ */ React.createElement("table", {
    className: "table-fixed mt-1 space-x-1 text-base lg:text-lg xl:text-xl font-normal leading-4 text-gray-500 text-center"
  }, /* @__PURE__ */ React.createElement("thead", {
    className: "text-sm md:text-md lg:text-lg xl:text-xl font-medium leading-5 text-black font-['Alata']"
  }, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", {
    className: "pl-1 pr-2 whitespace-nowrap"
  }, "Transit Type"), /* @__PURE__ */ React.createElement("th", {
    className: "px-3 md:px-4 xl:px-5"
  }, "Distance"), /* @__PURE__ */ React.createElement("th", {
    className: "px-3 md:px-4 xl:px-5"
  }, "Duration"), /* @__PURE__ */ React.createElement("th", {
    className: "px-6 md:px-7 xl:px-8"
  }, "CO", /* @__PURE__ */ React.createElement("sub", null, "2")))), /* @__PURE__ */ React.createElement("tbody", null, props.sidebarData.sort((a, b) => 0).map((transport) => /* @__PURE__ */ React.createElement("tr", {
    key: transport.id,
    className: classNames(`${props.activeTravelType === transport.type ? "outline ring-blue-400 ring-2 z-10" : ""}`, "relative rounded-md py-4 hover:bg-gray-100 mt-1 space-x-1 font-normal leading-4 text-gray-500 pl-2 pr-3 font-['Maven_Pro']"),
    onClick: () => props.setActiveTravelType(transport.type)
  }, /* @__PURE__ */ React.createElement("td", {
    className: "text-xs md:text-sm lg:text-base xl:text-lg font-medium leading-5 flex text-black items-center font-sans"
  }, /* @__PURE__ */ React.createElement("img", {
    src: "/images/" + transport.type + ".png",
    className: "max-h-5 max-w-5",
    onError: (event) => event.target.style.display = "none"
  }), transport.title), /* @__PURE__ */ React.createElement("td", null, parseDistance(transport.distanceMeters, transport.distanceRank)), /* @__PURE__ */ React.createElement("td", null, parseDuration(transport.durationSeconds, transport.durationRank)), /* @__PURE__ */ React.createElement("td", null, parseCarbon(transport.carbonGrams, transport.carbonRank)), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("a", {
    href: "#",
    className: classNames("absolute inset-0 rounded-md", "ring-blue-400 focus:z-10 focus:outline-none focus:ring-2")
  })))))));
}

// app/routes/maps.tsx
var import_api = require("@react-google-maps/api");

// app/components/curved-polyline.tsx
var import_turf = require("@turf/turf"), import_projection = require("@turf/projection");
function CurvedPolyline(origin, dest) {
  if (origin == null || dest == null)
    return console.log(origin), console.log(dest), {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: []
      },
      properties: null
    };
  let test = (0, import_turf.greatCircle)([origin.lng, origin.lat], [dest.lng, dest.lat], { npoints: 100, offset: 100 }), route = {
    type: "LineString",
    coordinates: [
      [origin.lng, origin.lat],
      [dest.lng, dest.lat]
    ]
  };
  route = (0, import_projection.toWgs84)(route);
  let lineDist = (0, import_turf.lineDistance)(route, { units: "kilometers" }), midPoint = (0, import_turf.midpoint)(route.coordinates[0], route.coordinates[1]), center = (0, import_turf.destination)(midPoint, lineDist, (0, import_turf.bearing)(route.coordinates[0], route.coordinates[1]) + 90), linearc = (0, import_turf.lineArc)(center, (0, import_turf.distance)(center, route.coordinates[0]), (0, import_turf.bearing)(center, route.coordinates[0]), (0, import_turf.bearing)(center, route.coordinates[1]), { steps: 500 });
  return (0, import_projection.toMercator)(linearc);
}

// app/layers/cycling.ts
var cyclingActive = {
  id: "cycling",
  type: "line",
  layout: {
    "line-cap": "round"
  },
  paint: {
    "line-color": "#d3db2e",
    "line-gradient": [
      "interpolate",
      ["linear"],
      ["line-progress"],
      0,
      "#d3db2e",
      1,
      "#cbd41c"
    ],
    "line-opacity": [
      "case",
      ["boolean", ["feature-state", "hover"], !1],
      1,
      ["boolean", ["feature-state", "fadein"], !1],
      0.07,
      0.9
    ],
    "line-width": [
      "interpolate",
      ["linear"],
      ["zoom"],
      12,
      5,
      16,
      13,
      22,
      25
    ]
  }
}, cyclingInactive = {
  id: "cycling",
  type: "line",
  layout: {
    "line-cap": "round"
  },
  paint: {
    "line-color": "#a0a0a0",
    "line-opacity": [
      "case",
      ["boolean", ["feature-state", "hover"], !1],
      1,
      ["boolean", ["feature-state", "fadein"], !1],
      0.07,
      0.5
    ],
    "line-width": [
      "interpolate",
      ["linear"],
      ["zoom"],
      12,
      5,
      16,
      13,
      22,
      25
    ]
  }
};

// app/layers/driving-traffic.ts
var drivingTrafficActive = {
  id: "driving-traffic",
  type: "line",
  layout: {
    "line-cap": "round"
  },
  paint: {
    "line-color": "#2066ba",
    "line-gradient": [
      "interpolate",
      ["linear"],
      ["line-progress"],
      0,
      "#2066ba",
      1,
      "#2088d0"
    ],
    "line-opacity": [
      "case",
      ["boolean", ["feature-state", "hover"], !1],
      1,
      ["boolean", ["feature-state", "fadein"], !1],
      0.07,
      0.9
    ],
    "line-width": [
      "interpolate",
      ["linear"],
      ["zoom"],
      12,
      5,
      16,
      13,
      22,
      25
    ]
  }
}, drivingTrafficInactive = {
  id: "driving-traffic",
  type: "line",
  layout: {
    "line-cap": "round"
  },
  paint: {
    "line-color": "#a0a0a0",
    "line-opacity": [
      "case",
      ["boolean", ["feature-state", "hover"], !1],
      1,
      ["boolean", ["feature-state", "fadein"], !1],
      0.07,
      0.5
    ],
    "line-width": [
      "interpolate",
      ["linear"],
      ["zoom"],
      12,
      5,
      16,
      13,
      22,
      25
    ]
  }
};

// app/layers/public-transport.ts
var publicTransportActive = {
  id: "public-transport",
  type: "line",
  layout: {
    "line-cap": "round"
  },
  paint: {
    "line-color": "#20ba44",
    "line-dasharray": [2, 3],
    "line-opacity": [
      "case",
      ["boolean", ["feature-state", "hover"], !1],
      1,
      ["boolean", ["feature-state", "fadein"], !1],
      0.07,
      0.9
    ],
    "line-width": [
      "interpolate",
      ["linear"],
      ["zoom"],
      12,
      5,
      16,
      13,
      22,
      25
    ]
  }
}, publicTransportInactive = {
  id: "public-transport",
  type: "line",
  layout: {
    "line-cap": "round"
  },
  paint: {
    "line-color": "#a0a0a0",
    "line-dasharray": [2, 3],
    "line-opacity": [
      "case",
      ["boolean", ["feature-state", "hover"], !1],
      1,
      ["boolean", ["feature-state", "fadein"], !1],
      0.07,
      0.5
    ],
    "line-width": [
      "interpolate",
      ["linear"],
      ["zoom"],
      12,
      5,
      16,
      13,
      22,
      25
    ]
  }
};

// app/layers/walking.ts
var walkingActive = {
  id: "walking",
  type: "line",
  layout: {
    "line-cap": "round"
  },
  paint: {
    "line-dasharray": [0, 2],
    "line-color": "#20ba44",
    "line-gradient": [
      "interpolate",
      ["linear"],
      ["line-progress"],
      0,
      "#20ba44",
      1,
      "#20dc44"
    ],
    "line-opacity": [
      "case",
      ["boolean", ["feature-state", "hover"], !1],
      1,
      ["boolean", ["feature-state", "fadein"], !1],
      0.07,
      0.9
    ],
    "line-width": [
      "interpolate",
      ["linear"],
      ["zoom"],
      12,
      5,
      16,
      13,
      22,
      25
    ]
  }
}, walkingInactive = {
  id: "walking",
  type: "line",
  layout: {
    "line-cap": "round"
  },
  paint: {
    "line-color": "#a0a0a0",
    "line-dasharray": [0, 2],
    "line-opacity": [
      "case",
      ["boolean", ["feature-state", "hover"], !1],
      1,
      ["boolean", ["feature-state", "fadein"], !1],
      0.07,
      0.5
    ],
    "line-width": [
      "interpolate",
      ["linear"],
      ["zoom"],
      12,
      5,
      16,
      13,
      22,
      25
    ]
  }
};

// app/layers/LayerMap.ts
var layerMap = {
  "driving-traffic": {
    activeLayer: drivingTrafficActive,
    inactiveLayer: drivingTrafficInactive
  },
  cycling: {
    activeLayer: cyclingActive,
    inactiveLayer: cyclingInactive
  },
  walking: {
    activeLayer: walkingActive,
    inactiveLayer: walkingInactive
  },
  "public-transport": {
    activeLayer: publicTransportActive,
    inactiveLayer: publicTransportInactive
  }
};

// app/routes/maps.tsx
async function loader8({ request }) {
  return [process.env.MAPBOX_API_KEY, process.env.MAPS_API_KEY];
}
var links2 = () => [{ rel: "stylesheet", href: "https://api.tiles.mapbox.com/mapbox-gl-js/v0.53.0/mapbox-gl.css", as: "fetch" }], libraries = ["places"];
function Maps() {
  var _a;
  let [isShowingTopMenu, setIsShowingTopMenu] = (0, import_react14.useState)(!0), apiKey = (0, import_react13.useLoaderData)(), MapboxGeocoderSDK = require("@mapbox/mapbox-sdk/services/geocoding"), MapboxDirectionsModule = require("@mapbox/mapbox-sdk/services/directions"), directionService = new MapboxDirectionsModule({
    accessToken: apiKey[0],
    unit: "metric",
    alternatives: !1,
    geometries: "geojson",
    controls: { instructions: !1 },
    flyTo: !0
  }), geocodingClient = new MapboxGeocoderSDK({
    accessToken: apiKey[0]
  }), travelTypes = ["driving-traffic", "walking", "cycling"], carbonMultipliers = {
    "driving-traffic": 271,
    cycling: 5,
    walking: 5e-4,
    "public-transport": 118,
    bus: 73,
    train: 13.2
  }, lowerLat = 1.2, upperLat = 1.48, lowerLng = 103.59, upperLng = 104.05, mapboxMapRef = (0, import_react14.useRef)(null), [mapboxMap, setMapboxMap] = (0, import_react14.useState)(), startMarker = (0, import_react14.useRef)(), endMarker = (0, import_react14.useRef)(), [markerSelector, setMarkerSelector] = (0, import_react14.useState)("");
  (0, import_react14.useEffect)(() => {
    mapboxMapRef != null && mapboxMapRef.current != null && (setMapboxMap(mapboxMapRef.current.getMap()), startMarker.current = new import_mapbox_gl.default.Marker({ color: "#20ba44" }), endMarker.current = new import_mapbox_gl.default.Marker({ color: "#972FFE" }));
  }, [(_a = mapboxMapRef.current) == null ? void 0 : _a.loaded]);
  let startRef = (0, import_react14.useRef)(null), endRef = (0, import_react14.useRef)(null), [startLngLat, setStartLngLat] = (0, import_react14.useState)(), [endLngLat, setEndLngLat] = (0, import_react14.useState)(), noFeature = {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: []
    },
    properties: null
  }, [activeTravelType, setActiveTravelType] = (0, import_react14.useState)("driving-traffic"), [availableRoutes, setAvailableRoutes] = (0, import_react14.useState)({
    "driving-traffic": noFeature,
    cycling: noFeature,
    walking: noFeature,
    "public-transport": noFeature
  }), [activeRoute, setActiveRoute] = (0, import_react14.useState)(), [inactiveRoutes, setInactiveRoutes] = (0, import_react14.useState)(availableRoutes), [routesDistances, setRoutesDistances] = (0, import_react14.useState)({
    "driving-traffic": 0,
    cycling: 0,
    walking: 0,
    "public-transport": 0
  }), [routesDuration, setRoutesDuration] = (0, import_react14.useState)({
    "driving-traffic": 0,
    cycling: 0,
    walking: 0,
    "public-transport": 0
  }), [routesCarbon, setRoutesCarbon] = (0, import_react14.useState)({
    "driving-traffic": 0,
    cycling: 0,
    walking: 0,
    "public-transport": 0
  }), [sidebarData, setSidebarData] = (0, import_react14.useState)([
    {
      id: 1,
      title: "Driving",
      type: "driving-traffic",
      distanceMeters: 0,
      durationSeconds: 0,
      carbonGrams: 0
    },
    {
      id: 2,
      title: "Cycling",
      type: "cycling",
      distanceMeters: 0,
      durationSeconds: 0,
      carbonGrams: 0
    },
    {
      id: 3,
      title: "Walking",
      type: "walking",
      distanceMeters: 0,
      durationSeconds: 0,
      carbonGrams: 0
    },
    {
      id: 4,
      title: "Public Transit",
      type: "public-transport",
      distanceMeters: 0,
      durationSeconds: 0,
      carbonGrams: 0
    }
  ]);
  (0, import_react14.useEffect)(() => {
    setSidebarData((prevState) => {
      let update = [
        ...prevState
      ], sortedDistance = Object.keys(routesDistances).sort((a, b) => routesDistances[a] - routesDistances[b]), sortedDuration = Object.keys(routesDuration).sort((a, b) => routesDuration[a] - routesDuration[b]), sortedCarbon = Object.keys(routesCarbon).sort((a, b) => routesCarbon[a] - routesCarbon[b]);
      return update.map((value) => {
        value.distanceMeters = routesDistances[value.type], value.durationSeconds = routesDuration[value.type], value.carbonGrams = routesCarbon[value.type], value.distanceRank = sortedDistance.indexOf(value.type), value.durationRank = sortedDuration.indexOf(value.type), value.carbonRank = sortedCarbon.indexOf(value.type);
      }), update;
    });
  }, [routesDistances, routesDuration]), (0, import_react14.useEffect)(() => {
    let features = {};
    travelTypes.forEach((travelType) => {
      travelType !== activeTravelType && (features[travelType] = availableRoutes[travelType]);
    }), setInactiveRoutes(features), activeTravelType !== void 0 && setActiveRoute(availableRoutes[activeTravelType]);
  }, [activeTravelType, availableRoutes]);
  let { isLoaded } = (0, import_api.useLoadScript)({
    googleMapsApiKey: apiKey[1],
    libraries
  });
  if (!isLoaded)
    return /* @__PURE__ */ React.createElement("div", null);
  let transitService = new google.maps.DirectionsService(), calculateRoute = async () => {
    if (startRef.current === null || startRef.current.value === "" || endRef.current === null || endRef.current.value === "" || startLngLat == null || endLngLat == null)
      return;
    let newRoutes = {}, newDistances = {}, newDuration = {}, newCarbon = {};
    await Promise.all(travelTypes.map((travelType) => directionService.getDirections({
      profile: travelType,
      waypoints: [
        {
          coordinates: [startLngLat.lng, startLngLat.lat]
        },
        {
          coordinates: [endLngLat.lng, endLngLat.lat]
        }
      ],
      overview: "full",
      exclude: "ferry"
    }).send().then((response) => {
      let geometry = (0, import_polyline.toGeoJSON)(response.body.routes[0].geometry);
      newRoutes[travelType] = {
        type: "Feature",
        geometry,
        properties: null
      }, newDistances[travelType] = response.body.routes[0].distance, newDuration[travelType] = response.body.routes[0].duration, newCarbon[travelType] = response.body.routes[0].distance / 1e3 * carbonMultipliers[travelType];
    }).catch(() => {
      newRoutes[travelType] = noFeature, newDistances[travelType] = 0, newDuration[travelType] = 0, newCarbon[travelType] = 0;
    }))), await transitService.route({
      origin: startLngLat.lat + ", " + startLngLat.lng,
      destination: endLngLat.lat + ", " + endLngLat.lng,
      travelMode: google.maps.TravelMode.TRANSIT,
      avoidFerries: !0
    }).then((response) => {
      console.log(response.routes[0]);
      let trainDist = 0, busDist = 0, walkDist = 0, miscDist = 0;
      response.routes[0].legs[0].steps.map((step) => {
        step.travel_mode === "WALKING" ? walkDist += step.distance.value : step.travel_mode === "TRANSIT" && step.transit.line.vehicle.type === "SUBWAY" ? trainDist += step.distance.value : step.travel_mode === "TRANSIT" && step.transit.line.vehicle.type === "BUS" ? busDist += step.distance.value : miscDist += step.distance.value;
      }), newRoutes["public-transport"] = CurvedPolyline(startLngLat, endLngLat);
      let totalCarbon = walkDist * carbonMultipliers.walking + trainDist * carbonMultipliers.train + busDist * carbonMultipliers.bus + miscDist * carbonMultipliers["public-transport"];
      newDistances["public-transport"] = response.routes[0].legs[0].distance.value, newDuration["public-transport"] = response.routes[0].legs[0].duration.value, newCarbon["public-transport"] = totalCarbon / 1e3;
    }).catch(() => {
      newRoutes["public-transport"] = noFeature, newDistances["public-transport"] = 0, newDuration["public-transport"] = 0, newCarbon["public-transport"] = 0;
    }), console.log(newRoutes), setAvailableRoutes(newRoutes), setRoutesDistances(newDistances), setRoutesDuration(newDuration), setRoutesCarbon(newCarbon);
  }, placeMarker = (latLng, marker) => {
    marker.current !== void 0 && latLng !== null && (marker.current.setLngLat(latLng), marker.current.addTo(mapboxMap));
  }, getFeatureFromCoordinates = (latLng) => geocodingClient.reverseGeocode({
    query: [latLng == null ? void 0 : latLng.lng, latLng == null ? void 0 : latLng.lat]
  }).send().then((response) => response.body.features[0] ? response.body.features[0] : null), getPlaceName = (feature, latLng) => feature != null ? feature.place_name : String((latLng == null ? void 0 : latLng.lng) + ", " + (latLng == null ? void 0 : latLng.lat)), setMarkers = async (lngLat) => {
    if (startRef.current !== null && markerSelector === "startLocation") {
      let feature = await getFeatureFromCoordinates(lngLat);
      startRef.current.value = getPlaceName(feature, lngLat), setStartLngLat(lngLat), placeMarker(lngLat, startMarker);
    } else if (endRef.current !== null && markerSelector === "endLocation") {
      let feature = await getFeatureFromCoordinates(lngLat);
      endRef.current.value = getPlaceName(feature, lngLat), setEndLngLat(lngLat), placeMarker(lngLat, endMarker);
    }
    setMarkerSelector("");
  }, mapClick = async (e) => {
    markerSelector !== "" ? await setMarkers(e.lngLat) : e.features != null && console.log(e.features);
  };
  return /* @__PURE__ */ React.createElement("div", {
    className: "bg-gray-400 flex h-screen justify-center"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "w-full h-full z-0"
  }, /* @__PURE__ */ React.createElement(import_react_map_gl.default, {
    initialViewState: {
      bounds: [lowerLng, lowerLat, upperLng, upperLat],
      zoom: 14
    },
    mapboxAccessToken: apiKey[0],
    renderWorldCopies: !1,
    boxZoom: !1,
    logoPosition: "bottom-left",
    attributionControl: !1,
    pitchWithRotate: !1,
    dragRotate: !0,
    touchPitch: !1,
    onClick: mapClick,
    ref: mapboxMapRef,
    reuseMaps: !0,
    style: { display: "flex absolute" },
    mapStyle: "mapbox://styles/mapbox/dark-v10"
  }, /* @__PURE__ */ React.createElement(import_react_map_gl.Source, {
    id: "driving-traffic",
    type: "geojson",
    tolerance: 1,
    buffer: 0,
    lineMetrics: !0,
    data: availableRoutes["driving-traffic"]
  }, /* @__PURE__ */ React.createElement(import_react_map_gl.Layer, __spreadValues({}, activeTravelType === "driving-traffic" ? layerMap["driving-traffic"].activeLayer : layerMap["driving-traffic"].inactiveLayer))), /* @__PURE__ */ React.createElement(import_react_map_gl.Source, {
    id: "cycling",
    type: "geojson",
    tolerance: 1,
    buffer: 0,
    lineMetrics: !0,
    data: availableRoutes.cycling
  }, /* @__PURE__ */ React.createElement(import_react_map_gl.Layer, __spreadValues({}, activeTravelType === "cycling" ? layerMap.cycling.activeLayer : layerMap.cycling.inactiveLayer))), /* @__PURE__ */ React.createElement(import_react_map_gl.Source, {
    id: "walking",
    type: "geojson",
    tolerance: 1,
    buffer: 0,
    lineMetrics: !0,
    data: availableRoutes.walking
  }, /* @__PURE__ */ React.createElement(import_react_map_gl.Layer, __spreadValues({}, activeTravelType === "walking" ? layerMap.walking.activeLayer : layerMap.walking.inactiveLayer))), /* @__PURE__ */ React.createElement(import_react_map_gl.Source, {
    id: "public-transport",
    type: "geojson",
    tolerance: 1,
    buffer: 0,
    lineMetrics: !0,
    data: availableRoutes["public-transport"]
  }, /* @__PURE__ */ React.createElement(import_react_map_gl.Layer, __spreadValues({}, activeTravelType === "public-transport" ? layerMap["public-transport"].activeLayer : layerMap["public-transport"].inactiveLayer))))), /* @__PURE__ */ React.createElement(import_react12.Transition, {
    appear: !0,
    as: import_react14.Fragment,
    show: isShowingTopMenu,
    enter: "transform duration-200 transition ease-in-out",
    enterFrom: "opacity-0 scale-95",
    enterTo: "opacity-100 rotate-0 scale-100",
    leave: "transform duration-200 transition ease-in-out",
    leaveFrom: "opacity-100 rotate-0 scale-100 ",
    leaveTo: "opacity-0 scale-95 "
  }, /* @__PURE__ */ React.createElement(import_react13.Form, {
    className: "z-1 flex-grow w-screen flex-col absolute px-2 shadow-lg text-xl bg-gray-200 sm:w-auto sm:py-1 sm:px-3 sm:rounded-b-3xl sm:left-1 md:flex-row md:left-5 lg:left-1/4 xl:left-auto"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "border-separate mb-1 sm:px-4 sm:flex sm:items-start sm:justify-between sm:space-x-1 md:mb-2"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "md:mr-4"
  }, /* @__PURE__ */ React.createElement("label", {
    className: "flex flex-row text-gray-700 text-sm font-bold sm:mb-0.5",
    htmlFor: "origin"
  }, "Origin", /* @__PURE__ */ React.createElement(import_react12.Switch, {
    checked: markerSelector === "startLocation",
    onChange: () => setMarkerSelector(markerSelector === "startLocation" ? "" : "startLocation"),
    className: "ml-auto mr-2"
  }, /* @__PURE__ */ React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    className: `${markerSelector === "startLocation" ? "outline-double fill-slate-500" : ""} h-5 w-5 outline-1 outline-black hover:outline-double hover:fill-slate-500`,
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    "stroke-width": "2"
  }, /* @__PURE__ */ React.createElement("path", {
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    d: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
  }), /* @__PURE__ */ React.createElement("path", {
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    d: "M15 11a3 3 0 11-6 0 3 3 0 016 0z"
  })))), /* @__PURE__ */ React.createElement("input", {
    autoComplete: "street-address",
    className: "shadow appearance-none border rounded w-full py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline",
    id: "Start Point",
    type: "text",
    placeholder: "Enter start point",
    ref: startRef
  })), /* @__PURE__ */ React.createElement("div", {
    className: ""
  }, /* @__PURE__ */ React.createElement("label", {
    className: "flex flex-row text-gray-700 text-sm font-bold sm:mb-0.5",
    htmlFor: "destination"
  }, "Destination", /* @__PURE__ */ React.createElement(import_react12.Switch, {
    checked: markerSelector === "endLocation",
    onChange: () => setMarkerSelector(markerSelector === "endLocation" ? "" : "endLocation"),
    className: "ml-auto mr-2"
  }, /* @__PURE__ */ React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    className: `${markerSelector == "endLocation" ? "outline-double fill-slate-500" : ""} h-5 w-5 outline-1 outline-black hover:outline-double hover:fill-slate-500`,
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    "stroke-width": "2"
  }, /* @__PURE__ */ React.createElement("path", {
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    d: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
  }), /* @__PURE__ */ React.createElement("path", {
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    d: "M15 11a3 3 0 11-6 0 3 3 0 016 0z"
  })))), /* @__PURE__ */ React.createElement("input", {
    className: "shadow appearance-none border rounded w-full py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline",
    id: "End Point",
    type: "text",
    placeholder: "Enter end point",
    ref: endRef
  }))), /* @__PURE__ */ React.createElement("div", {
    className: "flex items-center justify-between sm:flex-row"
  }, /* @__PURE__ */ React.createElement("button", {
    className: "bg-green-600 hover:bg-green-700 text-white font-medium py-1 px-2 mb-2 ml-auto sm:mr-4 rounded focus:outline-none focus:shadow-outline",
    type: "button",
    onClick: calculateRoute
  }, "Calculate")))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", {
    id: "desktop-sidebar",
    className: "absolute z-10 right-1 top-28 hidden sm:block w-auto px-2 sm:px-0"
  }, /* @__PURE__ */ React.createElement(StatsWindow, {
    sidebarData,
    activeTravelType,
    setActiveTravelType
  }))));
}

// server-assets-manifest:@remix-run/dev/assets-manifest
var assets_manifest_default = { version: "98d8fc3f", entry: { module: "/build/entry.client-L63XLYV6.js", imports: ["/build/_shared/chunk-2HJOQVBF.js", "/build/_shared/chunk-J4EE5LOM.js", "/build/_shared/chunk-5SG4DK2S.js"] }, routes: { root: { id: "root", parentId: void 0, path: "", index: void 0, caseSensitive: void 0, module: "/build/root-54NWIOFX.js", imports: void 0, hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/healthcheck": { id: "routes/healthcheck", parentId: "root", path: "healthcheck", index: void 0, caseSensitive: void 0, module: "/build/routes/healthcheck-CPDO2VR4.js", imports: void 0, hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/index": { id: "routes/index", parentId: "root", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/index-4KIOZH5L.js", imports: ["/build/_shared/chunk-XE4ZAWSM.js"], hasAction: !1, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/join": { id: "routes/join", parentId: "root", path: "join", index: void 0, caseSensitive: void 0, module: "/build/routes/join-RY4VQIQQ.js", imports: ["/build/_shared/chunk-27HH3RNS.js", "/build/_shared/chunk-XE4ZAWSM.js", "/build/_shared/chunk-3TNEPCUC.js"], hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/login": { id: "routes/login", parentId: "root", path: "login", index: void 0, caseSensitive: void 0, module: "/build/routes/login-S5OQTAYI.js", imports: ["/build/_shared/chunk-27HH3RNS.js", "/build/_shared/chunk-XE4ZAWSM.js", "/build/_shared/chunk-3TNEPCUC.js"], hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/logout": { id: "routes/logout", parentId: "root", path: "logout", index: void 0, caseSensitive: void 0, module: "/build/routes/logout-JT62SE2N.js", imports: void 0, hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/maps": { id: "routes/maps", parentId: "root", path: "maps", index: void 0, caseSensitive: void 0, module: "/build/routes/maps-EPR7NMFS.js", imports: ["/build/_shared/chunk-DECPSMZZ.js"], hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/notes": { id: "routes/notes", parentId: "root", path: "notes", index: void 0, caseSensitive: void 0, module: "/build/routes/notes-5NQMFPDX.js", imports: ["/build/_shared/chunk-XE4ZAWSM.js", "/build/_shared/chunk-VLTS5H2Q.js", "/build/_shared/chunk-3TNEPCUC.js"], hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/notes/$noteId": { id: "routes/notes/$noteId", parentId: "routes/notes", path: ":noteId", index: void 0, caseSensitive: void 0, module: "/build/routes/notes/$noteId-KZIEX3C7.js", imports: void 0, hasAction: !0, hasLoader: !0, hasCatchBoundary: !0, hasErrorBoundary: !0 }, "routes/notes/index": { id: "routes/notes/index", parentId: "routes/notes", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/notes/index-U3Q572JV.js", imports: void 0, hasAction: !1, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/notes/new": { id: "routes/notes/new", parentId: "routes/notes", path: "new", index: void 0, caseSensitive: void 0, module: "/build/routes/notes/new-OXZEL2JV.js", imports: void 0, hasAction: !0, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 } }, url: "/build/manifest-98D8FC3F.js" };

// server-entry-module:@remix-run/dev/server-build
var assetsBuildDirectory = "public\\build", publicPath = "/build/", entry = { module: entry_server_exports }, routes = {
  root: {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: root_exports
  },
  "routes/healthcheck": {
    id: "routes/healthcheck",
    parentId: "root",
    path: "healthcheck",
    index: void 0,
    caseSensitive: void 0,
    module: healthcheck_exports
  },
  "routes/logout": {
    id: "routes/logout",
    parentId: "root",
    path: "logout",
    index: void 0,
    caseSensitive: void 0,
    module: logout_exports
  },
  "routes/index": {
    id: "routes/index",
    parentId: "root",
    path: void 0,
    index: !0,
    caseSensitive: void 0,
    module: routes_exports
  },
  "routes/login": {
    id: "routes/login",
    parentId: "root",
    path: "login",
    index: void 0,
    caseSensitive: void 0,
    module: login_exports
  },
  "routes/notes": {
    id: "routes/notes",
    parentId: "root",
    path: "notes",
    index: void 0,
    caseSensitive: void 0,
    module: notes_exports
  },
  "routes/notes/$noteId": {
    id: "routes/notes/$noteId",
    parentId: "routes/notes",
    path: ":noteId",
    index: void 0,
    caseSensitive: void 0,
    module: noteId_exports
  },
  "routes/notes/index": {
    id: "routes/notes/index",
    parentId: "routes/notes",
    path: void 0,
    index: !0,
    caseSensitive: void 0,
    module: notes_exports2
  },
  "routes/notes/new": {
    id: "routes/notes/new",
    parentId: "routes/notes",
    path: "new",
    index: void 0,
    caseSensitive: void 0,
    module: new_exports
  },
  "routes/join": {
    id: "routes/join",
    parentId: "root",
    path: "join",
    index: void 0,
    caseSensitive: void 0,
    module: join_exports
  },
  "routes/maps": {
    id: "routes/maps",
    parentId: "root",
    path: "maps",
    index: void 0,
    caseSensitive: void 0,
    module: maps_exports
  }
};
module.exports = __toCommonJS(stdin_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  assets,
  assetsBuildDirectory,
  entry,
  publicPath,
  routes
});
//# sourceMappingURL=index.js.map
