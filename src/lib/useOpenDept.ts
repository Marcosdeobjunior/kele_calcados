import { useNavigate } from 'react-router-dom';
import type { Dept } from '../types';
import { useStore } from '../state/store';
import { EMPTY_FILTERS } from './catalog';

/** Abre a página do departamento com os filtros zerados. */
export function useOpenDept() {
  const navigate = useNavigate();
  const { setFilters } = useStore();
  return (d: Dept) => {
    setFilters(EMPTY_FILTERS);
    navigate(`/departamento/${d.toLowerCase()}`);
  };
}
