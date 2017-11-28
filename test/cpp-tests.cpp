#include "../cpp/main.cpp"
#include "cpp-mocks.cpp"
#include "gmock/gmock.h"
#include "gtest/gtest.h"

using ::testing::AtLeast;
using ::testing::WithArgs;
using ::testing::MockFunction;
using ::testing::Invoke;
using ::testing::InSequence;
using ::testing::Return;

/*
    https://github.com/google/googletest/blob/master/googletest/docs/Samples.md
    https://github.com/google/googletest/blob/master/googlemock/docs/CookBook.md

    Tips:
    - Write tests in such a way that their order does not affect results. They may not be run in
        the same order they are written in
*/

MockStuff::MockStuff () {}
MockStuff::~MockStuff () {}


namespace {

    TEST(Util, addTwo) {
        EXPECT_EQ(Util::addTwo(1, 2), 3);
        EXPECT_EQ(Util::addTwo(3, 2), 5);
        EXPECT_EQ(Util::addTwo(-3, 2), -1);
        EXPECT_EQ(Util::addTwo(-3, 0), -3);
    }

    TEST(Util, addThree) {
        EXPECT_EQ(Util::addThree(1, 2, 3), 6);
        EXPECT_EQ(Util::addThree(1, 2, -3), 0);
    }

    TEST(Util, multTwo) {
        EXPECT_EQ(Util::multTwo(3, 4), 12);
        EXPECT_EQ(Util::multTwo(3, 0), 0);
    }

    TEST(Main, getInstance) {
        Main* instance = Main::getInstance();
        EXPECT_EQ(instance, Main::instance);
    }

    // Mocks examples
    TEST(MockTest, test) {
        MockStuff mStuff;

        EXPECT_CALL(mStuff, test())
            .Times(AtLeast(1));

        Things* t = new Things(&mStuff);
        t->test();
    }

    TEST(MockTest, callFn1AndFn2Twice) {
        MockStuff mStuff;

        EXPECT_CALL(mStuff, fn1())
            .Times(2);
        EXPECT_CALL(mStuff, fn2())
            .Times(2);

        Things* t = new Things(&mStuff);
        t->callFn1AndFn2Twice();
    }

    TEST(MockTest, multTwo) {
        MockStuff mStuff;
        EXPECT_CALL(mStuff, multTwo(3, 4))
            .WillOnce(Invoke(Util::multTwo));

        Things* t = new Things(&mStuff);
        t->multTwo(3, 4);
    }

    TEST(MockTest, addFour) {
        MockStuff mStuff;

        EXPECT_CALL(mStuff, addTwo(1, 2))
            .Times(1)
            .WillOnce(Return(3));

        EXPECT_CALL(mStuff, addThree(3, 4, 3))
            .Times(1)
            .WillOnce(Return(10));

        Things* t = new Things(&mStuff);
        t->addFour(1, 2, 3, 4);
    }

    // Testing the same function in sequence with different results
    // https://github.com/google/googletest/blob/master/googlemock/docs/CookBook.md#using-check-points
    TEST(MockTest, testMockingParamSequence) {
        MockStuff mStuff;
        Things* t = new Things(&mStuff);

        MockFunction<int(int x)> check;
        {

            InSequence s;
            // x = 0
            EXPECT_CALL(mStuff, addTwo(1, 2));
            EXPECT_CALL(check, Call(0));
            // x = 1
            EXPECT_CALL(mStuff, addThree(1, 2, 3));
            EXPECT_CALL(check, Call(1));
            // // x = 2
            EXPECT_CALL(mStuff, addTwo(1, 2));
            EXPECT_CALL(check, Call(2));
            // x = 3
            EXPECT_CALL(check, Call(3));
            // x = 4
            EXPECT_CALL(mStuff, addTwo(1, 2));
            EXPECT_CALL(check, Call(4));
            // x = 5
            EXPECT_CALL(mStuff, addThree(1, 2, 3));
        }

        t->testMockingParamSequence(0);
        check.Call(0);
        t->testMockingParamSequence(1);
        check.Call(1);
        t->testMockingParamSequence(2);
        check.Call(2);
        t->testMockingParamSequence(3);
        check.Call(3);
        t->testMockingParamSequence(4);
        check.Call(4);
        t->testMockingParamSequence(5);
    }

}

int main (int argc, char** argv) {
    ::testing::InitGoogleMock(&argc, argv);
    return RUN_ALL_TESTS();
}