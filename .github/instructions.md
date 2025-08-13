# Copilot Coding Agent Instructions for ProjectManager Frontend

## Architecture Overview
- **Framework:** Angular 19.x, TypeScript 5.7.x, using Angular signals for local state and reactivity.
- **Major Directories:**
  - `src/app/component/`: UI components (cards, dialogs, search bars, etc.)
  - `src/app/service/`: Service layer (data, API, business logic)
  - `src/app/page-component/`: Page-level containers (dashboard, subModule, bug, etc.)
  - `src/app/model/`: Shared types/interfaces
- **State Management:**
  - Prefer Angular signals (`signal`, `computed`, `effect`) for local and shared state.
  - Avoid RxJS for new code unless integrating with legacy patterns.
- **Service Boundaries:**
  - `DataProcessingService`: Central state, user/project/session logic, API calls, localStorage sync.
  - `ProjectPageService`: Project list, project-specific logic, depends on `DataProcessingService` (use `Injector` for lazy injection to avoid circular DI).
  - Other services: Dialog, search, login, etc. follow similar boundaries.
- **Component Patterns:**
  - Inputs/Outputs: Use plain array Inputs, avoid passing signals as Inputs. Use consolidated label/config objects for related props.
  - EventEmitters: Use for selection and action events; prefer descriptive names (`itemSelected`, `action`).
  - Dialogs: Use container/presentational split; emit events for CRUD actions.
  - Search bars: Generic base component, wrap for domain-specific use.

## Developer Workflows
- **Build:**
  - `ng build` (outputs to `dist/`)
- **Dev Server:**
  - `ng serve` (http://localhost:4200)
- **Unit Tests:**
  - `ng test` (Karma runner)
- **E2E Tests:**
  - `ng e2e` (add your own framework)
- **Component Generation:**
  - `ng generate component <name>`

## Project-Specific Conventions
- **Signals:**
  - Use signals for all local state and shared service state.
  - Do not pass signals as @Input; use arrays/objects and convert to signals internally.
- **Circular Dependency Avoidance:**
  - Use Angular `Injector` for lazy service injection if two services need to reference each other.
- **LocalStorage:**
  - User/project/session state is persisted in localStorage and hydrated into signals on startup/login.
- **API Integration:**
  - All backend calls go through `DataProcessingService` (see `host` property for endpoint).
- **Type Guards:**
  - Use explicit type guards for discriminating between `WorkData` and `BugData`.
- **Role Logic:**
  - Role checks use numeric IDs and computed signals; see `isRole`, `isWebMasterOrManager` in `DataProcessingService`.

## Integration Points
- **Backend:**
  - REST API at `https://project-manager-backend-theta.vercel.app/api`
- **Material UI:**
  - Uses Angular Material modules for form fields, inputs, dialogs, etc.
- **Routing:**
  - Angular Router for navigation; page components handle route logic.

## Examples
- **Signal Input Pattern:**
  ```typescript
  @Input() items: readonly NameListItem[] = [];
  private _items = signal<NameListItem[]>([]);
  @Input() set items(v: readonly NameListItem[]) { this._items.set(v ?? []); }
  ```
- **Lazy Service Injection:**
  ```typescript
  private injector = inject(Injector);
  private get pageService(): ProjectPageService {
    return this.injector.get(ProjectPageService);
  }
  ```

## Key Files
- `src/app/service/data-processing.service.ts`: Central state, API, session logic
- `src/app/service/project-page.service.ts`: Project list, project logic
- `src/app/component/search-bar/search-bar.component.ts`: Search bar pattern
- `src/app/model/format.type.ts`: Shared types/interfaces

---