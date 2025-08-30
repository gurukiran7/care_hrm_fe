# Care HR-Management 🚀

Run with

```
npm run build
npm run preview -- --port 5173 
```

## Sidebar Integration Instructions

To ensure the care sidebar is hidden on HRM plugin routes, update the core app’s `AppRouter.tsx` ([link](https://github.com/ohcnetwork/care_fe/blob/develop/src/Routers/AppRouter.tsx)) file.

Add the following entries to the `PATHS_WITHOUT_SIDEBAR` array:

```js
"/hrm",
/^\/hrm(\/.*)?$/,
```