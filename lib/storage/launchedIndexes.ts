/**
 * LocalStorage Service for Launched Indexes
 * Centralizes all localStorage operations for launched index data
 */

import { IndexData } from '@/lib/types/index';

const STORAGE_KEY = 'launched-indexes';

/**
 * Storage service for managing launched indexes in localStorage
 */
export class LaunchedIndexesStorage {
  /**
   * Get all launched indexes from localStorage
   * @returns Array of IndexData objects, empty array if none found or parse error
   */
  static get(): IndexData[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];

      const parsed = JSON.parse(stored);
      return this.validate(parsed) ? parsed : [];
    } catch (error) {
      console.error('Failed to parse launched indexes from localStorage:', error);
      return [];
    }
  }

  /**
   * Add a new launched index to localStorage
   * @param index - The index data to add
   * @returns true if successful, false if error occurred
   */
  static add(index: IndexData): boolean {
    try {
      const existing = this.get();
      const updated = [...existing, index];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return true;
    } catch (error) {
      console.error('Failed to add launched index to localStorage:', error);
      return false;
    }
  }

  /**
   * Update an existing launched index by ID
   * @param id - The index ID to update
   * @param updates - Partial updates to apply
   * @returns true if successful, false if not found or error occurred
   */
  static update(id: string, updates: Partial<IndexData>): boolean {
    try {
      const existing = this.get();
      const index = existing.findIndex(item => item.id === id);

      if (index === -1) return false;

      existing[index] = { ...existing[index], ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
      return true;
    } catch (error) {
      console.error('Failed to update launched index in localStorage:', error);
      return false;
    }
  }

  /**
   * Remove a launched index by ID
   * @param id - The index ID to remove
   * @returns true if successful, false if not found or error occurred
   */
  static remove(id: string): boolean {
    try {
      const existing = this.get();
      const filtered = existing.filter(item => item.id !== id);

      if (filtered.length === existing.length) return false;

      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Failed to remove launched index from localStorage:', error);
      return false;
    }
  }

  /**
   * Clear all launched indexes from localStorage
   */
  static clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear launched indexes from localStorage:', error);
    }
  }

  /**
   * Validate that data is an array of IndexData objects
   * @param data - Data to validate
   * @returns true if valid, false otherwise
   */
  private static validate(data: any): data is IndexData[] {
    if (!Array.isArray(data)) return false;

    return data.every(item =>
      typeof item === 'object' &&
      typeof item.id === 'string' &&
      typeof item.name === 'string' &&
      typeof item.symbol === 'string' &&
      Array.isArray(item.assets)
    );
  }
}
