// src/app/components/card-module/card-module.component.ts
import {
  Component,
  inject,
  Input,
  signal,
  Output,
  EventEmitter,
} from "@angular/core";
import type {
  SubModuleData,
  NameListItem,
  WorkData,
  ModuleData,
} from "../../model/format.type";
import { CommonModule } from "@angular/common";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatIconModule } from "@angular/material/icon";
import { DataProcessingService } from "../../service/data-processing.service";
import { DialogService } from "../../service/dialog.service";
import { PopUpChangeComponent } from "../pop-up-change/pop-up-change.component";
import { ExpandableWorkContainerComponent } from "../expandable-work-container/expandable-work-container.component";
import { CardSubModuleComponent } from "../card-sub-module/card-sub-module.component";

@Component({
  selector: "app-card-module",
  imports: [
    CommonModule,
    MatTooltipModule,
    MatIconModule,
    PopUpChangeComponent,
    ExpandableWorkContainerComponent,
    CardSubModuleComponent,
  ],
  templateUrl: "./card-module.component.html",
  styleUrl: "./card-module.component.css",
})
export class CardModuleComponent {
  dataService = inject(DataProcessingService);
  dialogService = inject(DialogService);

  @Input() moduleData: ModuleData = {
    moduleId: 1,
    moduleName: "Sample Module",
    startDate: new Date(),
    targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    priorityId: 1,
    priorityName: "HIGH",
    workStateCountList: [
      { id: 1, name: "NEW", count: 3, percentage: 0 },
      { id: 2, name: "ASSIGNED", count: 2, percentage: 0 },
      { id: 3, name: "IN PROGRESS", count: 5, percentage: 0 },
    ],
    description: "abc",
    picId: 1,
    picName: "Alice",
    createdBy: "Alice",
    projectName: "Sample Project",
    subModuleList: [],
  };

  @Output() cardDeleted = new EventEmitter<number>();

  expanded = signal(false);
  periodPercentage = signal<number>(0);
  totalWork = signal(0);

  workList = signal<WorkData[]>([]);

  // 🔹 untuk submodules hasil API
  subModules = signal<SubModuleData[]>([]);
  loadingSubModules = signal(false);

  ngOnInit() {
    this.countTotalWorkState();
    this.countPercentage();
    this.periodPercentage.set(
      this.dataService.getPeriodDonePercentage(
        this.moduleData.startDate,
        this.moduleData.targetDate,
      ),
    );
  }

  countTotalWorkState() {
    let total = 0;
    for (const state of this.moduleData.workStateCountList) {
      total += state.count;
    }
    this.totalWork.set(total);
  }

  countPercentage() {
    for (const state of this.moduleData.workStateCountList) {
      state.percentage = (100 * state.count) / this.totalWork();
    }
  }

  getTooltip(name: string, count: number, percentage: number): string {
    const formattedPercentage = Math.floor(percentage * 10) / 10;
    return `${name} ${count}/${this.totalWork()} (${formattedPercentage}%)`;
  }

  expandWorkInside() {
    this.expanded.set(!this.expanded());
    console.log("Expand clicked:", this.expanded(), this.subModules());
  }

  refreshWorkList() {
    // placeholder untuk implementasi API module works
  }

  openForm() {
    // placeholder untuk buka dialog edit module
  }

  updatesubModuleData(type: "priority", item: NameListItem) {
    // placeholder untuk update priority module
  }

  toggleExpand() {
    this.expanded.set(!this.expanded());

    // 🔹 load submodules hanya sekali saat pertama expand
    if (this.expanded() && this.subModules().length === 0) {
      this.loadSubModules();
    }
  }

  private loadSubModules() {
    this.loadingSubModules.set(true);
    this.dataService
      .getProjectSubModulesByModule(this.moduleData.moduleId)
      .subscribe({
        next: (result) => {
          this.subModules.set(result);
          this.loadingSubModules.set(false);
        },
        error: (err) => {
          console.error("Failed to load submodules", err);
          this.loadingSubModules.set(false);
        },
      });
  }

  trackBySubModule(index: number, sub: SubModuleData): number {
    return sub.subModuleId;
  }
}
