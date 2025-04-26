export * from './Auth';
export * from './Agents';
export * from './Endpoints';
export * from './Files';
export * from './Messages';
export * from './Misc';
export * from './Tools';
export * from './connection';
export * from './mutations';
export * from './prompts';
export * from './queries';
export * from './roles';
export * from './tags';

// Create stub implementations for the missing functions
export const useGetEndpointsQuery = () => {
  return {
    data: [],
    isLoading: false,
    error: null
  };
};

export const useGetStartupConfig = () => {
  return {
    data: {},
    isLoading: false,
    error: null
  };
};

export const useGetUserBalance = () => {
  return {
    data: {},
    isLoading: false,
    error: null
  };
};

export const Tooltip = () => {};
export const TooltipContent = () => {};
export const TooltipProvider = () => {};
export const TooltipTrigger = () => {};
