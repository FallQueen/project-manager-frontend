// import { Component } from '@angular/core';
import { Component, inject, NgModule, signal, ViewChild } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { Router } from "@angular/router";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { CommonModule } from "@angular/common";
import { FormsModule, type NgForm } from "@angular/forms";
import { LoginService } from "../../service/login.service";
import { DataProcessingService } from "../../service/data-processing.service";

@Component({
	selector: "app-login-page",
	imports: [
		MatButtonModule,
		MatFormFieldModule,
		MatInputModule,
		CommonModule,
		FormsModule,
	],
	templateUrl: "./login-page.component.html",
	styleUrl: "./login-page.component.css",
})
export class LoginPageComponent {
	// Injects necessary services for login and data processing
	loginService = inject(LoginService);
	dataService = inject(DataProcessingService);
	// Injects Router to handle navigation between pages
	router = inject(Router);
	// Signal to display messages on UI when the login has failed
	loginFail = signal<boolean>(false);

	// Object to hold user's input values for username and password
	loginData = {
		username: "",
		password: "",
	};

	// On component initialization, check if the user is already logged in
	ngOnInit(): void {
		// If userIdSignal returns a value greater than 0, user is logged in, redirect to home
		if (this.dataService.userIdSignal() > 0) {
			this.router.navigate(["/home"]);
		}
	}

	// Function to handle login when the login button is clicked
	checkLogin(form: NgForm) {
		// If any form field is invalid, do not proceed and trigger validation errors
		if (form.invalid) {
			return;
		}

		// Extract username and password from loginData
		const { username, password } = this.loginData;
		// Call login service to authenticate user
		this.loginService.login(username, password).subscribe((result) => {
			// If login fails, set loginFail signal to true to display error message
			if (!result) {
				this.setLoginFail();
			}
		});
	}

	// Set loginFail signal to true to indicate login failure
	setLoginFail() {
		this.loginFail.set(true);
	}
}
