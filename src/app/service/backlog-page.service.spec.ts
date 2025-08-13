import { TestBed } from "@angular/core/testing";

import { subModulePageService } from "./subModule-page.service";

describe("subModulePageService", () => {
	let service: subModulePageService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(subModulePageService);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});
});
