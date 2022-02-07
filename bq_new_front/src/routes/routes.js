import React from 'react';
import {
    BrowserRouter,
    Switch,
    Route,
    Redirect
} from 'react-router-dom';
import { RouteWithLayout } from './../components';
import { Main as MainLayout, Minimal as MinimalLayout } from './../layouts';
import {
    SignUp,
    SignIn,
    UserTable,
    ProfileTable,
    ProfileDetails,
    RedefinePassword,
    ResetPassword,
    CourseTable,
    SkillTable,
    ObjectTable,
    PageNotFound,
    RequestUserTable,
    AccountDetails,
    Dashboard,
    EvaluationTable,
    EvaluationArchiveTable,
    EvaluationDetails,
    EvaluationQuestions,
    SkillDetails,
    ObjectDetails,
    RequestUserDetails,
    CourseDetails,
    UserRequestCourseTable,
    EvaluationApplicationTable,
    DoEvaluation,
    EvaluationApplicationDetails,
    EvaluationApplicationResults,
    StartEvaluation, EvaluationsResultStudent, EvaluationsResultStudentDetails,
    UserRequestCourseDetails,
    Unauthorized,
    TypeOfEvaluationTable,
    TypeOfEvaluationDetails,
    EvaluationPracticeTable,
    EvaluationPracticeArchiveTable,
    EvaluationPracticeDetails,
    GenerateEvaluationQuestions,
    GenerateEvaluation,
    EvaluationPracticeApplicationTable,
    EvaluationPracticeApplicationDetails,
    EvaluationPracticeApplicationResults,
} from '../pages';
import QuestionTable from "../pages/Professor/Question/QuestionTable";
import QuestionDetails from "../pages/Professor/Question/QuestionDetails";
import StudentClass from '../pages/StudentClass';

const Routes = () => (
    <BrowserRouter>
        <Switch>
            <Redirect
                exact
                from="/"
                to="/home"
            />
            {/*ROTAS COMUNS*/}
            <RouteWithLayout
                component={Dashboard}
                exact
                needToBeLogged={true}
                typeUser={-1}
                layout={MainLayout}
                path="/home" />
            <RouteWithLayout
                component={SignUp}
                exact
                layout={MinimalLayout}
                needToBeLogged={false}
                path="/sign-up" />
            <RouteWithLayout
                component={SignIn}
                exact
                layout={MinimalLayout}
                needToBeLogged={false}
                path="/sign-in" />
            <RouteWithLayout
                component={RedefinePassword}
                exact
                layout={MinimalLayout}
                needToBeLogged={false}
                path="/redefine-password" />
            <RouteWithLayout
                component={ResetPassword}
                exact
                layout={MinimalLayout}
                needToBeLogged={false}
                path="/reset-password/:token" />
            <RouteWithLayout
                component={AccountDetails}
                exact
                layout={MainLayout}
                needToBeLogged={true}
                typeUser={-1}
                path="/account" />
            <RouteWithLayout
                component={UserRequestCourseTable}
                exact
                needToBeLogged={true}
                typeUser={-1}
                layout={MainLayout}
                path="/requests" />
            <RouteWithLayout
                component={UserRequestCourseDetails}
                exact
                needToBeLogged={true}
                typeUser={-1}
                layout={MainLayout}
                path="/new-request" />
            <RouteWithLayout
                component={StudentClass}
                exact
                needToBeLogged={true}
                typeUser={-1}
                layout={MainLayout}
                path="/student-class" />
            {/* ROTAS DO ALUNO */}
            <RouteWithLayout
                component={EvaluationPracticeTable}
                exact
                needToBeLogged={true}
                layout={MainLayout}
                typeUser={-1}
                path="/evaluation-practice" />
            <RouteWithLayout
                component={EvaluationPracticeArchiveTable}
                exact
                needToBeLogged={true}
                layout={MainLayout}
                typeUser={-1}
                path="/evaluation-practice-archive" />
            <RouteWithLayout
                component={EvaluationPracticeDetails}
                exact
                layout={MainLayout}
                needToBeLogged={true}
                typeUser={-1}
                path="/evaluation-practice-details/:codigoEvaluation?" />
            <RouteWithLayout
                component={GenerateEvaluation}
                exact
                layout={MainLayout}
                needToBeLogged={true}
                typeUser={-1}
                path="/generate-evaluation/:codigoEvaluation?" />
            <RouteWithLayout
                component={GenerateEvaluationQuestions}
                exact
                layout={MainLayout}
                needToBeLogged={true}
                typeUser={-1}
                path="/generate-evaluation/:codigoEvaluation/questions" />
            
            <RouteWithLayout
                component={EvaluationPracticeApplicationTable}
                exact
                layout={MainLayout}
                needToBeLogged={true}
                typeUser={-1}
                path="/evaluation-practice/applications-evaluation/:idApplication" />
            <RouteWithLayout
                component={EvaluationPracticeApplicationDetails}
                exact
                layout={MainLayout}
                needToBeLogged={true}
                typeUser={-1}
                path="/evaluation-practice/:codigoEvaluation/applications-evaluation/details/:idApplication" />
            <RouteWithLayout
                component={EvaluationPracticeApplicationResults}
                exact
                layout={MainLayout}
                needToBeLogged={true}
                typeUser={-1}
                path="/evaluation-practice/applications-evaluation/results/:idApplication" />

            <RouteWithLayout
                component={StartEvaluation}
                exact
                layout={MinimalLayout}
                needToBeLogged={true}
                typeUser={-1}
                path="/student/start-evaluation" />
            <RouteWithLayout
                component={EvaluationsResultStudent}
                exact
                layout={MainLayout}
                needToBeLogged={true}
                typeUser={-1}
                path="/student/result-evaluations" />
            <RouteWithLayout
                component={EvaluationsResultStudentDetails}
                exact
                layout={MainLayout}
                needToBeLogged={true}
                typeUser={-1}
                path="/student/result-evaluations/details/:idHead" />
            <RouteWithLayout
                component={DoEvaluation}
                exact
                layout={MinimalLayout}
                needToBeLogged={true}
                typeUser={-1}
                path="/code/:codeAplication" />s
        {/*ROTAS DO ADMINISTRADOR*/}
            <RouteWithLayout
                component={CourseTable}
                exact
                layout={MainLayout}
                needToBeLogged={true}
                typeUser={1}
                path="/courses" />
            <RouteWithLayout
                component={CourseDetails}
                exact
                layout={MainLayout}
                typeUser={1}
                needToBeLogged={true}
                path="/course-details/:codigoCourse?" />
            <RouteWithLayout
                component={TypeOfEvaluationTable}
                exact
                layout={MainLayout}
                needToBeLogged={true}
                typeUser={1}
                path="/type-of-evaluation" />
            <RouteWithLayout
                component={TypeOfEvaluationDetails}
                exact
                layout={MainLayout}
                typeUser={1}
                needToBeLogged={true}
                path="/type-of-evaluation-details/:typeOfEvaluationCode?" />
            <RouteWithLayout
                component={SkillTable}
                exact
                layout={MainLayout}
                needToBeLogged={true}
                typeUser={1}
                path="/skills" />
            <RouteWithLayout
                component={SkillDetails}
                exact
                layout={MainLayout}
                needToBeLogged={true}
                typeUser={1}
                path="/skill-details/:codigoSkill?" />
            <RouteWithLayout
                component={ObjectTable}
                exact
                layout={MainLayout}
                needToBeLogged={true}
                typeUser={1}
                path="/objects" />
            <RouteWithLayout
                component={ObjectDetails}
                exact
                layout={MainLayout}
                needToBeLogged={true}
                typeUser={1}
                path="/object-details/:codigoObject?" />
            <RouteWithLayout
                component={UserTable}
                exact
                needToBeLogged={true}
                layout={MainLayout}
                typeUser={1}
                path="/users" />
            <RouteWithLayout
                component={RequestUserTable}
                exact
                needToBeLogged={true}
                layout={MainLayout}
                typeUser={1}
                path="/users/requests" />
            <RouteWithLayout
                component={RequestUserDetails}
                exact
                needToBeLogged={true}
                layout={MainLayout}
                typeUser={1}
                path="/users/requests/:codigoCourseProfessor" />
            {/*ROTAS DO PROFESSOR*/}
            <RouteWithLayout
                component={EvaluationTable}
                exact
                needToBeLogged={true}
                layout={MainLayout}
                typeUser={2}
                path="/evaluations" />
            <RouteWithLayout
                component={EvaluationArchiveTable}
                exact
                needToBeLogged={true}
                layout={MainLayout}
                typeUser={2}
                path="/evaluations-archive" />
            <RouteWithLayout
                component={EvaluationQuestions}
                exact
                needToBeLogged={true}
                layout={MainLayout}
                typeUser={2}
                path="/evaluation-questions/:evaluationId" />
            <RouteWithLayout
                component={EvaluationDetails}
                exact
                layout={MainLayout}
                needToBeLogged={true}
                typeUser={2}
                path="/evaluation-details/:codigoEvaluation?" />
            <RouteWithLayout
                component={EvaluationApplicationTable}
                exact
                layout={MainLayout}
                needToBeLogged={true}
                typeUser={2}
                path="/applications-evaluation" />
            <RouteWithLayout
                component={EvaluationApplicationDetails}
                exact
                layout={MainLayout}
                needToBeLogged={true}
                typeUser={2}
                path="/applications-evaluation/details/:idApplication" />
            <RouteWithLayout
                component={EvaluationApplicationResults}
                exact
                layout={MainLayout}
                needToBeLogged={true}
                typeUser={2}
                path="/applications-evaluation/results/:idApplication"
                goToDestination />
            <RouteWithLayout
                component={QuestionTable}
                exact
                layout={MainLayout}
                needToBeLogged={true}
                typeUser={2}
                path="/questions" />
            <RouteWithLayout
                component={QuestionDetails}
                exact
                layout={MainLayout}
                needToBeLogged={true}
                typeUser={2}
                path="/question-details/:idQuestion?" />

            <RouteWithLayout
                component={Unauthorized}
                exact
                layout={MinimalLayout}
                needToBeLogged={false}
                typeUser={2}
                path="/unauthorized" />
            <RouteWithLayout
                path="*"
                layout={MinimalLayout}
                needToBeLogged={false}
                component={PageNotFound} />
        </Switch>
    </BrowserRouter>
);

export default Routes;
