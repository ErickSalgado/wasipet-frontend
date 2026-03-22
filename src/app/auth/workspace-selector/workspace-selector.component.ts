import { Component, OnInit, signal, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-workspace-selector',
  standalone: true,
  templateUrl: './workspace-selector.component.html',
  styleUrl: './workspace-selector.component.scss'
})
export class WorkspaceSelectorComponent implements OnInit {
  private readonly router = inject(Router);

  // State management using Signals
  currentUser = signal<any>(null);
  selectedBranch = signal<string>('Sede Principal'); // Default branch
  isLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.loadUserData();
  }

  // Retrieve user data from localStorage
  private loadUserData(): void {
    const savedUser = localStorage.getItem('wasipet_user');
    
    if (savedUser) {
      this.currentUser.set(JSON.parse(savedUser));
    } else {
      // Security measure: if no user data is found, redirect to login
      this.router.navigate(['/login']);
    }
  }

  // Handle branch selection
  selectBranch(branchName: string): void {
    this.selectedBranch.set(branchName);
  }

  // Action for the main button
  enterSystem(): void {
    this.isLoading.set(true);
    
    console.log('Entering system with branch:', this.selectedBranch());
    
    // Simulate a brief loading state for better UX, then navigate
    setTimeout(() => {
      this.router.navigate(['/dashboard']);
    }, 800);
  }
}