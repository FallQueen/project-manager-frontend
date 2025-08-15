import type { Routes } from "@angular/router";
import { LoginPageComponent } from "./page-component/login-page/login-page.component";
import { HomePageComponent } from "./page-component/home-page/home-page.component";

export const routes: Routes = [
	{
		path: "",
		pathMatch: "full",
		component: LoginPageComponent, // Login page is loaded first.
	},
	{
		path: "home",
		component: HomePageComponent,
		children: [
			{
				path: "",
				pathMatch: "full",
				redirectTo: "/home/(home:dashboard)",
			},
			{
				path: "dashboard",
				loadComponent: () =>
					import(
						"./page-component/dashboard-page/dashboard-page.component"
					).then((c) => c.DashboardPageComponent),
				outlet: "home",
			},
			{
				path: "project",
				loadComponent: () =>
					import("./page-component/project-page/project-page.component").then(
						(c) => c.ProjectPageComponent,
					),
				outlet: "home",
			},
			{
				path: "bug",
				loadComponent: () =>
					import("./page-component/bug-page/bug-page.component").then(
						(c) => c.BugPageComponent,
					),
				outlet: "home",
			},
			{
				path: "backlog",
				loadComponent: () =>
					import("./page-component/backlog-page/backlog-page.component").then(
						(c) => c.BacklogPageComponent,
					),
				outlet: "home",
			},
			{
				path: "gantt",
				loadComponent: () =>
					import("./page-component/gantt-page/gantt-page.component").then(
						(c) => c.GanttPageComponent,
					),
				outlet: "home",
			},
		],
	},
];
