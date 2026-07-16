import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { canAccessRedaction, canAccessEditorial } from '../utils/permissions';
import ProtectedRoute from './ProtectedRoute';
import { MainLayout } from '../layouts/MainLayout';
import { Login } from '../pages/Login/Login';
import MyArticles from '../pages/MyArticles/MyArticles';
import NewArticleForm from '../pages/NewArticleForm/NewArticleForm.jsx';
import ArticlesInReview from '../pages/ArticlesInReview/ArticlesInReview.jsx';
import ArticlePreview from '../pages/ArticlePreview/ArticlePreview.jsx';
import ArticlesPublished from '../pages/ArticlesPublished/ArticlesPublished.jsx';

const NewArticleFormWrapper = () => {
  const location = useLocation();
  return <NewArticleForm initialValues={location.state?.article} />;
};

const homeFor = (user) => (canAccessRedaction(user) ? '/my-articles' : '/in-review');

export const AppRouter = () => {
  const { currentUser, isAuthenticated } = useAuth();

  return (
      <Routes>
        <Route
            path="/login"
            element={
              !isAuthenticated ? <Login /> : <Navigate to={homeFor(currentUser)} replace />
            }
        />

        <Route
            path="/*"
            element={
              isAuthenticated ? (
                  <MainLayout>
                    <Routes>
                      <Route
                          path="/my-articles"
                          element={
                            <ProtectedRoute requirePermission={canAccessRedaction}>
                              <MyArticles />
                            </ProtectedRoute>
                          }
                      />
                      <Route
                          path="/new-article"
                          element={
                            <ProtectedRoute requirePermission={canAccessRedaction}>
                              <NewArticleFormWrapper />
                            </ProtectedRoute>
                          }
                      />
                      <Route
                          path="/preview"
                          element={
                            <ProtectedRoute requirePermission={canAccessRedaction}>
                              <ArticlePreview />
                            </ProtectedRoute>
                          }
                      />
                      <Route
                          path="/in-review"
                          element={
                            <ProtectedRoute requirePermission={canAccessEditorial}>
                              <ArticlesInReview />
                            </ProtectedRoute>
                          }
                      />
                      <Route
                          path="/published"
                          element={
                            <ProtectedRoute requirePermission={canAccessEditorial}>
                              <ArticlesPublished />
                            </ProtectedRoute>
                          }
                      />

                      <Route path="*" element={<Navigate to={homeFor(currentUser)} replace />} />
                    </Routes>
                  </MainLayout>
              ) : (
                  <Navigate to="/login" replace />
              )
            }
        />
      </Routes>
  );
};