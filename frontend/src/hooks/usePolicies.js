import { useState, useEffect, useCallback } from 'react';
import policyService from '../services/policyService';

export const usePolicies = (params = {}) => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(null);

  const fetchPolicies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await policyService.getPolicies(params);
      setPolicies(res.data.items);
      setTotal(res.data.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchPolicies();
  }, [fetchPolicies]);

  return { policies, loading, total, error, refetch: fetchPolicies };
};

export default usePolicies;
